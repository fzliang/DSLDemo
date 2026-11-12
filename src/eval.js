import valid from "semver/functions/valid";

import gt from "semver/functions/gt";
import lt from "semver/functions/lt";
import eq from "semver/functions/eq";
import neq from "semver/functions/neq";
import gte from "semver/functions/gte";
import lte from "semver/functions/lte";

import { Op } from "./common";

// Full semver (valid(), prerelease kept). Shorthand: "v12" / "13.0" (dot or v-prefix).
// Bare integers like "10" stay numeric so `s > 4` with {s:"10"} is not semver.
const VERSION_SHORTHAND = /^(v\d+(\.\d+){0,2}|\d+\.\d+(\.\d+)?)$/;

function asVersion(value) {
  if (typeof value !== "string") {
    return null;
  }
  const parsed = valid(value);
  if (parsed) {
    return parsed;
  }
  if (!VERSION_SHORTHAND.test(value)) {
    return null;
  }
  const parts = value.replace(/^v/, "").split(".");
  return `${Number(parts[0])}.${parts[1] !== undefined ? Number(parts[1]) : 0}.${
    parts[2] !== undefined ? Number(parts[2]) : 0
  }`;
}

function compare(op, leftValue, rightValue) {
  const leftVer = asVersion(leftValue);
  const rightVer = asVersion(rightValue);
  const isSemverMode = leftVer !== null && rightVer !== null;
  const isMixedVersion = (leftVer !== null) !== (rightVer !== null);

  if (isMixedVersion) {
    return op === Op.ExclamationEqualsToken;
  }

  if (isSemverMode) {
    switch (op) {
      case Op.GreaterThanToken:
        return gt(leftVer, rightVer);
      case Op.GreaterThanEqualsToken:
        return gte(leftVer, rightVer);
      case Op.LessThanToken:
        return lt(leftVer, rightVer);
      case Op.LessThanEqualsToken:
        return lte(leftVer, rightVer);
      case Op.EqualsEqualsToken:
        return eq(leftVer, rightVer);
      case Op.ExclamationEqualsToken:
        return neq(leftVer, rightVer);
      default:
        throw new Error(`非法 op: ${op}`);
    }
  }

  switch (op) {
    case Op.GreaterThanToken:
      return leftValue > rightValue;
    case Op.GreaterThanEqualsToken:
      return leftValue >= rightValue;
    case Op.LessThanToken:
      return leftValue < rightValue;
    case Op.LessThanEqualsToken:
      return leftValue <= rightValue;
    case Op.EqualsEqualsToken:
      return leftValue == rightValue;
    case Op.ExclamationEqualsToken:
      return leftValue != rightValue;
    default:
      throw new Error(`非法 op: ${op}`);
  }
}

export function evaluate(command, params) {
  if (!Array.isArray(command)) {
    return command;
  }

  const [op, left, right] = command;

  if (op === Op.Identifier) {
    const value = params == null ? undefined : params[left];
    if (value === undefined) {
      throw new Error(`runtime error no identifier: ${left} value`);
    }
    return value;
  }

  const leftValue = evaluate(left, params);

  switch (op) {
    case Op.AmpersandAmpersandToken:
      return Boolean(leftValue && evaluate(right, params));
    case Op.BarBarToken:
      return Boolean(leftValue || evaluate(right, params));
    case Op.EqualsEqualsEqualsToken:
      return leftValue === evaluate(right, params);
    case Op.ExclamationEqualsEqualsToken:
      return leftValue !== evaluate(right, params);
  }

  return compare(op, leftValue, evaluate(right, params));
}
