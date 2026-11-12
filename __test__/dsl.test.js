let { createParser, runAST } = require("../dist/bundle.js");

const ast = createParser(
  '(s == "ios" && sv >= "13.0.0") || (s == "android" && sv >= "8.0.0" && sv <= "v12")'
).parse();

test("ios below 13 is false", () => {
  expect(runAST(ast, { s: "ios", sv: "8.0.1" })).toBe(false);
});

test("ios at 13 is true", () => {
  expect(runAST(ast, { s: "ios", sv: "13.0.0" })).toBe(true);
});

test("ios above 13 is true", () => {
  expect(runAST(ast, { s: "ios", sv: "14.0.0" })).toBe(true);
});

test("android at 8 is true", () => {
  expect(runAST(ast, { s: "android", sv: "8.0.0" })).toBe(true);
});

test("android above 8 is true", () => {
  expect(runAST(ast, { s: "android", sv: "8.0.1" })).toBe(true);
});

test("android 11 is true", () => {
  expect(runAST(ast, { s: "android", sv: "11.0.1" })).toBe(true);
});

test("android at 12 is true", () => {
  expect(runAST(ast, { s: "android", sv: "12.0.0" })).toBe(true);
});

test("android above 12 is false", () => {
  expect(runAST(ast, { s: "android", sv: "12.0.1" })).toBe(false);
});
