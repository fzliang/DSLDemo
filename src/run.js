import { SyntaxKind } from "./scanner";
import { createParser } from './parser';
import semver from 'semver';

function runBinaryExpression(ast, params) {
  let operator = ast.operator;

  let leftValue;
  let rightValue;

  let isSemverMode = false;

  if (ast.left && ast.right) {
    leftValue = runAST(ast.left, params);
    rightValue = runAST(ast.right, params);
  } else {
    throw new Error(`runBinaryExpression runtime error lost ast left or right ${JSON.stringify(ast)}`,)
  }

  const leftVersionStr = semver.valid(leftValue);
  const rightVersionStr = semver.valid(rightValue)


  if (!leftVersionStr && !rightVersionStr) {
    // 如果左右两边都不是版本字符串，则降级
    isSemverMode = false;
  } else if (leftVersionStr && rightVersionStr) {
    // 如果左右两边都是版本字符串，则使用semver匹配
    isSemverMode = true;
  } else if (!leftVersionStr || !rightVersionStr) {
    // 如果左右两边有一个不是版本字符串，则报错
    throw new Error(`runBinaryExpression runtime error type error ${leftVersionStr}, ${rightVersionStr}`)
  }

  switch (operator) {
    case SyntaxKind.GreaterThanToken:
      return isSemverMode ? semver.gt(leftValue, rightValue) : leftValue > rightValue;

    case SyntaxKind.GreaterThanEqualsToken:
      return isSemverMode ? semver.gte(leftValue, rightValue) : leftValue >= rightValue;

    case SyntaxKind.LessThanToken:
      return isSemverMode ? semver.lt(leftValue, rightValue) : leftValue < rightValue;

    case SyntaxKind.LessThanEqualsToken:
      return isSemverMode ? semver.lte(leftValue, rightValue) : leftValue <= rightValue;

    case SyntaxKind.EqualsEqualsToken:
      return isSemverMode ? semver.eq(leftValue, rightValue) : leftValue == rightValue;

    case SyntaxKind.EqualsEqualsEqualsToken:
      return isSemverMode ? semver.eq(leftValue, rightValue) : leftValue === rightValue;

    case SyntaxKind.ExclamationEqualsToken:
      return isSemverMode ? semver.neq(leftValue, rightValue) : leftValue != rightValue;

    case SyntaxKind.ExclamationEqualsEqualsToken:
      return isSemverMode ? semver.neq(leftValue, rightValue) : leftValue !== rightValue;

    case SyntaxKind.AmpersandAmpersandToken:
      return Boolean(leftValue && rightValue);

    case SyntaxKind.BarBarToken:
      return Boolean(leftValue || rightValue);

    default:
      throw new Error('runBinaryExpression runtime error')
  }
}

export function runAST(ast, params) {
  switch (ast.kind) {
    case SyntaxKind.StringLiteral:
    case SyntaxKind.NumericLiteral:
      return ast.text;

    case SyntaxKind.Identifier:
      const identifier = ast.text;
      let value = params[identifier];
      if (value === undefined) {
        throw new Error(`runAST runtime error no identiifer: ${identifier} value`)
      }
      return value;

    case SyntaxKind.BinaryExpression:
      return runBinaryExpression(ast, params);

    case SyntaxKind.ParenExpression:
      return runAST(ast.expression, params);

    default:
      throw new Error(`runAST runtime error no kind: ${ast.kind}`)
  }
}

export function runDSL(dsl, injectParams) {
  return runAST(createParser(dsl).parse(), injectParams)
}