import valid from "semver/functions/valid";
import coerce from "semver/functions/coerce";

import gt from "semver/functions/gt";
import lt from "semver/functions/lt";
import eq from "semver/functions/eq";
import neq from "semver/functions/neq";
import gte from "semver/functions/gte";
import lte from "semver/functions/lte";

import { Op } from "./common";

export function runCommand(command, params) {
  if (!Array.isArray(command)) {
    return command;
  }

  const [op, left, right] = command;

  if (op === Op.Identifier) {
    return params[left];
  }

  const leftValue = runCommand(left, params);

  // && 和 || 在有些情况可以只通过计算左值得到表达式的结果
  // 比如 && 左值为false，则整体结果为false
  // 比如 || 左值为true，则整体结果为true
  switch (op) {
    // &&
    case Op.AmpersandAmpersandToken: {
      if (leftValue === false) return false;
      return leftValue && runCommand(right, params);
    }

    // ||
    case Op.BarBarToken: {
      if (leftValue === true) return true;
      return leftValue || runCommand(right, params);
    }
  }

  const rightValue = runCommand(right, params);

  let isSemverMode;

  const leftVersionStr = valid(coerce(leftValue));
  const rightVersionStr = valid(coerce(rightValue));

  if (!leftVersionStr && !rightVersionStr) {
    // 如果左右两边都不是版本字符串，则降级
    isSemverMode = false;
  } else if (leftVersionStr && rightVersionStr) {
    // 如果左右两边都是版本字符串，则使用semver匹配
    isSemverMode = true;
  } else if (!leftVersionStr || !rightVersionStr) {
    // 如果左右两边有一个不是版本字符串，则报错
    throw new Error(
      `runBinaryExpression 类型错误: ${leftVersionStr}, ${rightVersionStr}`
    );
  }

  switch (op) {
    // ==
    case Op.EqualsEqualsToken:
      return isSemverMode
        ? eq(leftVersionStr, rightVersionStr)
        : leftValue === rightValue;
    // !=
    case Op.ExclamationEqualsToken:
      return isSemverMode
        ? neq(leftVersionStr, rightVersionStr)
        : leftValue != rightValue;
    // <
    case Op.LessThanToken:
      return isSemverMode
        ? lt(leftVersionStr, rightVersionStr)
        : leftValue < rightValue;
    // <=
    case Op.LessThanEqualsToken:
      return isSemverMode
        ? lte(leftVersionStr, rightVersionStr)
        : leftValue < rightValue;
    // >
    case Op.GreaterThanToken:
      return isSemverMode
        ? gt(leftVersionStr, rightVersionStr)
        : leftValue > rightValue;
    // >=
    case Op.GreaterThanEqualsToken:
      return isSemverMode
        ? gte(leftVersionStr, rightVersionStr)
        : leftValue >= rightValue;
    default:
      throw new Error("非法 op:", command);
  }
}

export function runJson(json, params) {
  const command = JSON.parse(json);
  return runCommand(command, params);
}

export function runJsonObj(jsonObj, params) {
  return runCommand(jsonObj, params);
}
