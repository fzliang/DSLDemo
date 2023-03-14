import { SyntaxKind } from "./scanner";
import { createParser } from "./parser";

import valid from "semver/functions/valid";
import coerce from "semver/functions/coerce";

import gt from "semver/functions/gt";
import lt from "semver/functions/lt";
import eq from "semver/functions/eq";
import neq from "semver/functions/neq";
import gte from "semver/functions/gte";
import lte from "semver/functions/lte";

function runBinaryExpression(ast, params) {
  let operator = ast.operator;

  let leftValue;
  let rightValue;

  let isSemverMode;

  if (ast.left && ast.right) {
    leftValue = runAST(ast.left, params);
  } else {
    throw new Error(`runBinaryExpression 错误: ${JSON.stringify(ast)}`);
  }

  // 如果是 && 或 ||, 右值lazy计算
  // !==, === 不需要semver
  switch (operator) {
    // &&
    case SyntaxKind.AmpersandAmpersandToken:
      return Boolean(leftValue && runAST(ast.right, params));
    // ||
    case SyntaxKind.BarBarToken:
      return Boolean(leftValue || runAST(ast.right, params));
    // ===
    case SyntaxKind.EqualsEqualsEqualsToken:
      return leftValue === runAST(ast.right, params);
    //!==
    case SyntaxKind.ExclamationEqualsEqualsToken:
      return leftValue !== runAST(ast.right, params);
  }

  rightValue = runAST(ast.right, params);

  let leftVersionStr = valid(leftValue);
  let rightVersionStr = valid(rightValue);

  if (!leftVersionStr && !rightVersionStr) {
    // 如果左右两边都不是版本字符串，则降级
    isSemverMode = false;
  } else if (leftVersionStr || rightVersionStr) {
    // 如果左右两边有一边是版本字符串，则两边都强制转换为版本队形
    isSemverMode = true;
    leftVersionStr = coerce(leftValue);
    rightVersionStr = coerce(rightValue);
  }

  switch (operator) {
    // >
    case SyntaxKind.GreaterThanToken:
      return isSemverMode
        ? gt(leftVersionStr, rightVersionStr)
        : leftValue > rightValue;
    // >=
    case SyntaxKind.GreaterThanEqualsToken:
      return isSemverMode
        ? gte(leftVersionStr, rightVersionStr)
        : leftValue >= rightValue;
    // <
    case SyntaxKind.LessThanToken:
      return isSemverMode
        ? lt(leftVersionStr, rightVersionStr)
        : leftValue < rightValue;
    // <=
    case SyntaxKind.LessThanEqualsToken:
      return isSemverMode
        ? lte(leftVersionStr, rightVersionStr)
        : leftValue <= rightValue;
    // ==
    case SyntaxKind.EqualsEqualsToken:
      return isSemverMode
        ? eq(leftVersionStr, rightVersionStr)
        : leftValue == rightValue;
    // !=
    case SyntaxKind.ExclamationEqualsToken:
      return isSemverMode
        ? neq(leftVersionStr, rightVersionStr)
        : leftValue != rightValue;

    default:
      throw new Error("runBinaryExpression runtime error: unknown operator");
  }
}

export function runAST(ast, params) {
  switch (ast.kind) {
    // 字符串
    case SyntaxKind.StringLiteral:
    //数字
    case SyntaxKind.NumericLiteral:
      return ast.text;
    // 标识符
    case SyntaxKind.Identifier:
      const identifier = ast.text;
      let value = params[identifier];
      if (value === undefined) {
        throw new Error(
          `runAST runtime error no identifier: ${identifier} value`
        );
      }
      return value;
    // 二元表达式
    case SyntaxKind.BinaryExpression:
      return runBinaryExpression(ast, params);
    // 括号表达式
    case SyntaxKind.ParenExpression:
      return runAST(ast.expression, params);

    default:
      throw new Error(`runAST runtime error no kind: ${ast.kind}`);
  }
}

export function runDSL(dsl, injectParams) {
  return runAST(createParser(dsl).parse(), injectParams);
}
