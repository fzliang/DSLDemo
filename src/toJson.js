import { SyntaxKind } from "./scanner";
import { createParser } from "./parser";

import { Op } from "./common";

export function astToJson(ast) {
  switch (ast.kind) {
    case SyntaxKind.StringLiteral:
    case SyntaxKind.NumericLiteral:
      return String(ast.text);

    case SyntaxKind.Identifier:
      const identifier = ast.text;
      return [Op.Identifier, identifier];

    case SyntaxKind.BinaryExpression:
      const op = Op[ast.operator];
      if (!op) {
        throw new Error("错误: 非法操作符", ast.operator);
      }

      return [op, astToJson(ast.left), astToJson(ast.right)];

    case SyntaxKind.ParenExpression:
      return astToJson(ast.expression);

    default:
      throw new Error(`错误: ${ast.kind}`);
  }
}

export function toJson(dsl) {
  return JSON.stringify(astToJson(createParser(dsl).parse()));
}

export function toJsonObj(dsl) {
  return astToJson(createParser(dsl).parse());
}
