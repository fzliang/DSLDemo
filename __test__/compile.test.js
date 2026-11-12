const { api, expectEquivalent } = require("./helpers");

const dsl =
  '(s == "ios" && sv >= "13.0.0") || (s == "android" && sv >= "8.0.0" && sv <= "v12")';

test("compile parses once and matches many params", () => {
  const match = api.compile(dsl);
  expect(match({ s: "ios", sv: "13.0.1" })).toBe(true);
  expect(match({ s: "android", sv: "12.0.0" })).toBe(true);
  expect(match({ s: "android", sv: "12.0.1" })).toBe(false);
});

test("matcher.toJSON round-trips through fromJSON", () => {
  const match = api.compile('s == "ios" && sv >= "13.0.0"');
  const restored = api.fromJSON(match.toJSON());
  expect(restored({ s: "ios", sv: "13.0.0" })).toBe(true);
  expect(restored({ s: "ios", sv: "12.9.9" })).toBe(false);
  expect(api.fromJSON(JSON.stringify(match.toJSON()))({ s: "ios", sv: "14.0.0" })).toBe(
    true
  );
});

test("runDSL agrees with compile", () => {
  expectEquivalent('s <= 4 && s >= 2', { s: 3 }, true);
  expect(api.runDSL('s <= 4 && s >= 2', { s: 3 })).toBe(
    api.compile('s <= 4 && s >= 2')({ s: 3 })
  );
});
