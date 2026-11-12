const { api, expectEquivalent } = require("./helpers");

test("trailing tokens after a valid expression are a parse error", () => {
  expect(() => api.createParser('s == "ios" garbage').parse()).toThrow(
    /意外的输入/
  );
  expect(() => api.runDSL('s == "ios" garbage', { s: "ios" })).toThrow();
});

test("tab and newline count as whitespace", () => {
  expectEquivalent('s\t==\n"ios"', { s: "ios" }, true);
  expectEquivalent('s == "ios"\r\n', { s: "ios" }, true);
});

test("decimal numeric literals parse and compare as numbers", () => {
  expectEquivalent("s > 4.5", { s: 5 }, true);
  expectEquivalent("s > 4.5", { s: 4 }, false);
  expectEquivalent("s == 8.0", { s: 8 }, true);
  expectEquivalent("s == 8.10", { s: 8.1 }, true);
});

test("unquoted dotted versions are not swallowed as a single number", () => {
  expect(() => api.createParser("sv >= 13.0.0").parse()).toThrow();
});

test("parse errors include position and message on the Error", () => {
  expect(() => api.createParser("s == @").parse()).toThrow(/pos:\d+.*非法字符/);
  expect(() => api.createParser('s == "unterminated').parse()).toThrow(
    /pos:\d+/
  );
});

test("empty input is a parse error", () => {
  expect(() => api.createParser("").parse()).toThrow();
});
