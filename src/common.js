const isDev = false;

export const Op = {
  // 变量
  Identifier: isDev ? "Ident" : 0x1,
  // &&
  AmpersandAmpersandToken: isDev ? "&&" : 0x2,
  // ||
  BarBarToken: isDev ? "||" : 0x3,
  // ==
  EqualsEqualsToken: isDev ? "==" : 0x4,
  // !=
  ExclamationEqualsToken: isDev ? "!=" : 0x5,
  // <
  LessThanToken: isDev ? "<" : 0x6,
  // <=
  LessThanEqualsToken: isDev ? "<=" : 0x7,
  // >
  GreaterThanToken: isDev ? ">" : 0x8,
  // >=
  GreaterThanEqualsToken: isDev ? ">=" : 0x9,
};