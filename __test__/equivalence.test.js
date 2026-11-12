const { api, expectEquivalent, expectAllThrow } = require("./helpers");

const cases = [
  ["s <= 4", { s: 4 }, true],
  ["s == 4", { s: 4 }, true],
  ["s != 4", { s: 4 }, false],
  ["s >= 4", { s: 4 }, true],
  ["s > 4", { s: 5 }, true],
  ["s > 4", { s: "3" }, false],
  ["s > 4", { s: "10" }, true],
  ['s || sv >= "99.0.0"', { s: "ios", sv: "1.0.0" }, true],
  ['s && sv >= "99.0.0"', { s: "ios", sv: "1.0.0" }, false],
  ['s === "ios"', { s: "ios" }, true],
  ['s === "ios"', { s: "android" }, false],
  ['s !== "ios"', { s: "android" }, true],
  ['(s == "ios" && sv >= "13.0.0") || (s == "android" && sv >= "8.0.0" && sv <= "v12")', { s: "ios", sv: "13.0.1" }, true],
  ['(s == "ios" && sv >= "13.0.0") || (s == "android" && sv >= "8.0.0" && sv <= "v12")', { s: "android", sv: "12.0.0" }, true],
  ['(s == "ios" && sv >= "13.0.0") || (s == "android" && sv >= "8.0.0" && sv <= "v12")', { s: "android", sv: "12.0.1" }, false],
];

test.each(cases)("AST and JSON agree: %s %j → %s", (expr, params, expected) => {
  expectEquivalent(expr, params, expected);
});

test("missing identifier throws on AST and JSON paths", () => {
  expectAllThrow("s == 1", {}, /no identifier: s/);
});

test("toJson accepts ===", () => {
  expect(() => api.toJson('s === "ios"')).not.toThrow();
  expectEquivalent('s === "ios"', { s: "ios" }, true);
});
