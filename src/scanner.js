export const CharacterCodes = {
  space: 0x0020,   // " "

  _: 0x5F,
  $: 0x24,

  _0: 0x30,
  _1: 0x31,
  _2: 0x32,
  _3: 0x33,
  _4: 0x34,
  _5: 0x35,
  _6: 0x36,
  _7: 0x37,
  _8: 0x38,
  _9: 0x39,

  a: 0x61,
  z: 0x7A,

  A: 0x41,
  Z: 0x5a,

  ampersand: 0x26,             // &
  bar: 0x7C,                   // |
  closeParen: 0x29,            // )
  doubleQuote: 0x22,           // "
  equals: 0x3D,                // =
  exclamation: 0x21,           // !
  greaterThan: 0x3E,           // >
  lessThan: 0x3C,              // <
  openParen: 0x28,             // (
  singleQuote: 0x27,           // '
}

export const SyntaxKind = {
  Unknown: 'Unknown',
  EndOfFileToken: 'EndOfFileToken',
  // Identifiers
  Identifier: 'Identifier',
  // Punctuation
  GreaterThanToken: 'GreaterThanToken',
  GreaterThanEqualsToken: 'GreaterThanEqualsToken',
  LessThanToken: 'LessThanToken',
  LessThanEqualsToken: 'LessThanEqualsToken',
  EqualsEqualsToken: 'EqualsEqualsToken',
  ExclamationEqualsToken: 'ExclamationEqualsToken',
  EqualsEqualsEqualsToken: 'EqualsEqualsEqualsToken',
  ExclamationEqualsEqualsToken: 'ExclamationEqualsEqualsToken',

  StringLiteral: 'StringLiteral',
  NumericLiteral: 'NumericLiteral',

  AmpersandAmpersandToken: 'AmpersandAmpersandToken',
  BarBarToken: 'BarBarToken',

  OpenParenToken: 'OpenParenToken',
  CloseParenToken: 'CloseParenToken',

  ParenExpression: 'ParenExpression',
  BinaryExpression: 'BinaryExpression',

  Missing: 'Missing'
}

var textToToken = {
  "<": SyntaxKind.LessThanToken,
  ">": SyntaxKind.GreaterThanToken,
  "<=": SyntaxKind.LessThanEqualsToken,
  ">=": SyntaxKind.GreaterThanEqualsToken,
  "==": SyntaxKind.EqualsEqualsToken,
  "!=": SyntaxKind.ExclamationEqualsToken,
  "===": SyntaxKind.EqualsEqualsEqualsToken,
  "!==": SyntaxKind.ExclamationEqualsEqualsToken,
  "&&": SyntaxKind.AmpersandAmpersandToken,
  "||": SyntaxKind.BarBarToken,
};


function isWhiteSpace(ch) {
  return ch === CharacterCodes.space;
}

function isDigit(ch) {
  return ch >= CharacterCodes._0 && ch <= CharacterCodes._9;
}

function isIdentifierStart(ch) {
  return ch >= CharacterCodes.A && ch <= CharacterCodes.Z || ch >= CharacterCodes.a && ch <= CharacterCodes.z
}

function isIdentifierPart(ch) {
  return ch >= CharacterCodes.A && ch <= CharacterCodes.Z || ch >= CharacterCodes.a && ch <= CharacterCodes.z ||
    ch >= CharacterCodes._0 && ch <= CharacterCodes._9 || ch === CharacterCodes.$ || ch === CharacterCodes._
}

export function createScanner(text, onError) {
  let pos;       // Current position (end position of text of current token)
  let len;       // Length of text
  let startPos;  // Start position of whitespace before current token
  let tokenPos;  // Start position of text of current token
  let token;
  let tokenValue;

  function error(message) {
    if (onError) {
      onError(message);
    }
  }

  function scanString() {
    let quote = text.charCodeAt(pos++);
    let result = "";
    let start = pos;

    while (true) {
      if (pos >= len) {
        result += text.substring(start, pos);
        error('Unexpected_end_of_text')
        break;
      }

      let ch = text.charCodeAt(pos)
      if (ch === quote) {
        result += text.substring(start, pos);
        pos++;
        break;
      }
      pos++;
    }

    return result;
  }

  function scanNumber() {
    var start = pos;
    while (isDigit(text.charCodeAt(pos))) pos++;
    if (text.charCodeAt(pos) === CharacterCodes.dot) {
      pos++;
      while (isDigit(text.charCodeAt(pos))) pos++;
    }
    var end = pos;
    return +(text.substring(start, end));
  }

  function getIdentifierToken() {
    let len = tokenValue.length;
    if (len >= 2 && len <= 11) {
      let ch = tokenValue.charCodeAt(0);
      if (ch >= CharacterCodes.a && ch <= CharacterCodes.z && hasOwnProperty.call(textToToken, tokenValue)) {
        return token = textToToken[tokenValue]
      }
      return token = SyntaxKind.Identifier
    }
    return token = SyntaxKind.Identifier;
  }

  function scan() {
    startPos = pos;
    while (true) {
      tokenPos = pos;
      if (pos >= len) {
        return token = SyntaxKind.EndOfFileToken
      }
      let ch = text.charCodeAt(pos);
      switch (ch) {
        case CharacterCodes.space:
          pos++;
          continue;

        // !=, !==
        case CharacterCodes.exclamation:
          if (text.charCodeAt(pos + 1) === CharacterCodes.equals) {
            if (text.charCodeAt(pos + 2) === CharacterCodes.equals) {
              return pos += 3, token = SyntaxKind.ExclamationEqualsEqualsToken;
            }
            return pos += 2, token = SyntaxKind.ExclamationEqualsToken;
          }
          error('只支持!=, !==')
          return pos++, token = SyntaxKind.Unknown;

        // ", '
        case CharacterCodes.doubleQuote:
        case CharacterCodes.singleQuote:
          tokenValue = scanString();
          return token = SyntaxKind.StringLiteral;

        // &
        case CharacterCodes.ampersand:
          if (text.charCodeAt(pos + 1) === CharacterCodes.ampersand) {
            return pos += 2, token = SyntaxKind.AmpersandAmpersandToken;
          }
          error('只支持&&');
          return pos++, token = SyntaxKind.Unknown;

        // (
        case CharacterCodes.openParen:
          return pos++, token = SyntaxKind.OpenParenToken;

        // )
        case CharacterCodes.closeParen:
          return pos++, token = SyntaxKind.CloseParenToken;

        // 0-9
        case CharacterCodes._0:
        case CharacterCodes._1:
        case CharacterCodes._2:
        case CharacterCodes._3:
        case CharacterCodes._4:
        case CharacterCodes._5:
        case CharacterCodes._6:
        case CharacterCodes._7:
        case CharacterCodes._8:
        case CharacterCodes._9:
          tokenValue = "" + scanNumber();
          return token = SyntaxKind.NumericLiteral;

        //  ==, ===
        case CharacterCodes.equals:
          if (text.charCodeAt(pos + 1) === CharacterCodes.equals) {
            if (text.charCodeAt(pos + 2) === CharacterCodes.equals) {
              return pos += 3, token = SyntaxKind.EqualsEqualsEqualsToken;
            }
            return pos += 2, token = SyntaxKind.EqualsEqualsToken;
          }
          error('只支持==， ===');
          return pos++, token = SyntaxKind.Unknown;

        // <, <=
        case CharacterCodes.lessThan:
          if (text.charCodeAt(pos + 1) === CharacterCodes.equals) {
            return pos += 2, token = SyntaxKind.LessThanEqualsToken;
          }
          return pos++, token = SyntaxKind.LessThanToken;

        // >, >=
        case CharacterCodes.greaterThan:
          if (text.charCodeAt(pos + 1) === CharacterCodes.equals) {
            return pos += 2, token = SyntaxKind.GreaterThanEqualsToken;
          }
          return pos++, token = SyntaxKind.GreaterThanToken;

        // ||
        case CharacterCodes.bar:
          if (text.charCodeAt(pos + 1) === CharacterCodes.bar) {
            return pos += 2, token = SyntaxKind.BarBarToken;
          }
          error('只支持||')
          return pos++, token = SyntaxKind.Unknown;

        default:
          if (isIdentifierStart(ch)) {
            pos++;
            while (pos < len && isIdentifierPart(ch = text.charCodeAt(pos))) pos++;
            tokenValue = text.substring(tokenPos, pos);
            return token = getIdentifierToken();
          }
          else if (isWhiteSpace(ch)) {
            pos++;
            continue;
          }
          error('非法字符');
          return pos++, token = SyntaxKind.Unknown;
      }
    }
  }

  function setText(newText) {
    text = newText || "";
    len = text.length;
    setTextPos(0);
  }

  function setTextPos(textPos) {
    pos = textPos;
    startPos = textPos;
    tokenPos = textPos;
    token = SyntaxKind.Unknown;
  }

  setText(text);

  return {
    getTextPos: () => pos,
    getTokenValue: () => tokenValue,
    isIdentifier: () => token === SyntaxKind.Identifier,
    scan: scan,
  };
}