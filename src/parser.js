import { createScanner, SyntaxKind } from "./scanner";

let objectAllocator = {
  getNodeConstructor: kind => {
    function Node() {
    }
    Node.prototype = {
      kind: kind,
      parent: undefined,
    };
    return Node;
  }
}


function createNode(kind) {
  const nodeConstructor = objectAllocator.getNodeConstructor(kind)
  var node = new nodeConstructor();
  return node;
}

function makeBinaryExpression(left, operator, right) {
  const node = createNode(SyntaxKind.BinaryExpression);
  node.left = left;
  node.operator = operator;
  node.right = right;
  return node;
}

export function createParser(text, onError = () => { }) {
  let scanner;
  let token;

  if (!text) {
    error('text不能为空')
    return;
  }

  function error(message) {
    console.log(`源表达式: ${text}`);
    if (onError) {
      console.log(message)
      console.log('\n')
      onError(message);
    }
    throw new Error("解析错误")
  }

  function errorAtPos(message) {
    let pos = scanner.getTextPos();
    error(`pos:${pos}, ${message}`)
  }

  function scanError(message) {
    errorAtPos(message);
  }

  function nextToken() {
    return token = scanner.scan();
  }


  function isIdentifier() {
    return token === SyntaxKind.Identifier;
  }

  function parseIdentifier() {
    const node = createNode(SyntaxKind.Identifier);
    node.text = scanner.getTokenValue();
    nextToken();
    return node;
  }

  function parseExpected(t) {
    if (token === t) {
      nextToken();
      return true;
    }
    error('parseExpected', t);
    return false;
  }

  function parseLiteralNode() {
    let node = createNode(token);
    let text = scanner.getTokenValue();
    node.text = text;

    nextToken();

    return node;
  }

  function parsePrimaryExpression() {
    switch (token) {
      case SyntaxKind.NumericLiteral:
      case SyntaxKind.StringLiteral:
        return parseLiteralNode();
      case SyntaxKind.OpenParenToken:
        return parseParenExpression();
      default:
        if (isIdentifier()) {
          return parseIdentifier();
        }
    }

    error("语法错误")
  }

  function parseUnaryExpression() {
    return parsePrimaryExpression();
  }

  function parseParenExpression() {
    var node = createNode(SyntaxKind.ParenExpression);
    parseExpected(SyntaxKind.OpenParenToken);
    node.expression = parseExpression();
    parseExpected(SyntaxKind.CloseParenToken);
    return node;
  }

  function getOperatorPrecedence() {
    switch (token) {
      case SyntaxKind.BarBarToken:
        return 1;
      case SyntaxKind.AmpersandAmpersandToken:
        return 2;
      case SyntaxKind.EqualsEqualsToken:
      case SyntaxKind.ExclamationEqualsToken:
      case SyntaxKind.EqualsEqualsEqualsToken:
      case SyntaxKind.ExclamationEqualsEqualsToken:
        return 3;
      case SyntaxKind.LessThanToken:
      case SyntaxKind.GreaterThanToken:
      case SyntaxKind.LessThanEqualsToken:
      case SyntaxKind.GreaterThanEqualsToken:
        return 4;
    }
    return undefined;
  }

  function parseBinaryOperators(expr, minPrecedence) {
    while (true) {
      const precedence = getOperatorPrecedence();
      if (precedence && precedence > minPrecedence) {
        const operator = token;
        nextToken();
        expr = makeBinaryExpression(expr, operator, parseBinaryOperators(parseUnaryExpression(), precedence));
        continue;
      }
      return expr;
    }
  }

  function parseBinaryExpression() {
    return parseBinaryOperators(parseUnaryExpression(), 0);
  }

  function parseExpression() {
    return parseBinaryExpression();
  }

  function parse() {
    scanner = createScanner(text, scanError)

    // 开始扫描
    nextToken();

    return parseExpression();
  }

  return {
    parse: parse
  }
}

