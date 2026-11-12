let { runDSL } = require("../dist/bundle.js");

test("number > true", () => {
  expect(runDSL("s > 4", { s: 5 })).toBe(true);
});

test("number > false", () => {
  expect(runDSL("s > 4", { s: "3" })).toBe(false);
});

test("number >= true", () => {
  expect(runDSL("s >= 4", { s: 4 })).toBe(true);
});

test("number >= false", () => {
  expect(runDSL("s >= 4", { s: "3" })).toBe(false);
});

test("number < true", () => {
  expect(runDSL("s < 4", { s: 3 })).toBe(true);
});

test("number < false", () => {
  expect(runDSL("s < 4", { s: 4 })).toBe(false);
});

test("number <= true", () => {
  expect(runDSL("s <= 4", { s: 4 })).toBe(true);
});

test("number <= false", () => {
  expect(runDSL("s <= 4", { s: 5 })).toBe(false);
});

test("number range true", () => {
  expect(runDSL("s <= 4 && s >= 2", { s: 3 })).toBe(true);
});

test("number range false", () => {
  expect(runDSL("s <= 4 && s >= 2", { s: 6 })).toBe(false);
});
