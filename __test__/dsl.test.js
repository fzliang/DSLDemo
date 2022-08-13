let { createParser, runAST, } = require('../dist/bundle.js')

const ast = createParser('(s == "ios" && sv >= "13.0.0") || (s == "android" && sv >= "8.0.0" && sv <= "12.0.0")').parse();


test('test || before lt false)', () => {
  expect(runAST(ast, { s: 'ios', sv: "8.0.1" })).toBe(false);
})

test('test || before gte true)', () => {
  expect(runAST(ast, { s: 'ios', sv: "13.0.0" })).toBe(true);
})

test('test || before gte true)', () => {
  expect(runAST(ast, { s: 'ios', sv: "14.0.0" })).toBe(true);
})

test('test || after gte true)', () => {
  expect(runAST(ast, { s: 'android', sv: "8.0.0" })).toBe(true);
})

test('test || after gt true)', () => {
  expect(runAST(ast, { s: 'android', sv: "8.0.1" })).toBe(true);
})

test('test || after lt true)', () => {
  expect(runAST(ast, { s: 'android', sv: "11.0.1" })).toBe(true);
})

test('test || after lte true)', () => {
  expect(runAST(ast, { s: 'android', sv: "12.0.0" })).toBe(true);
})

test('test || after lt false)', () => {
  expect(runAST(ast, { s: 'android', sv: "12.0.1" })).toBe(false);
})