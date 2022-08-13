import { SyntaxKind } from "./scanner";
import { createParser } from './parser';
import semver from 'semver';

function runBinaryExpression(ast, params) {
  let operator = ast.operator;

  let leftValue;
  let rightValue;

  if (ast.left && ast.right) {
    leftValue = runAST(ast.left, params);
    rightValue = runAST(ast.right, params);
  } else {
    throw new Error(`runBinaryExpression runtime error lost ast left or right ${JSON.stringify(ast)}`,)
  }

  switch (operator) {
    case SyntaxKind.GreaterThanToken:
      return semver.gt(leftValue, rightValue);

    case SyntaxKind.GreaterThanEqualsToken:
      return semver.gte(leftValue, rightValue);

    case SyntaxKind.LessThanToken:
      return semver.lt(leftValue, rightValue);

    case SyntaxKind.LessThanEqualsToken:
      return semver.lte(leftValue, rightValue);

    case SyntaxKind.EqualsEqualsToken:
      return leftValue == rightValue;

    case SyntaxKind.EqualsEqualsEqualsToken:
      return leftValue === rightValue;

    case SyntaxKind.ExclamationEqualsToken:
      return leftValue != rightValue;

    case SyntaxKind.ExclamationEqualsEqualsToken:
      return leftValue !== rightValue;

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