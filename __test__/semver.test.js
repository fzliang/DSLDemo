const { expectEquivalent } = require("./helpers");

test("prerelease is less than the matching release", () => {
  expectEquivalent('sv >= "1.0.0"', { sv: "1.0.0-beta" }, false);
  expectEquivalent('sv < "1.0.0"', { sv: "1.0.0-beta" }, true);
  expectEquivalent('sv == "1.0.0"', { sv: "1.0.0-beta" }, false);
  expectEquivalent('sv >= "1.0.0"', { sv: "1.0.0" }, true);
});

test("v-prefix and dotted partial versions normalize to major.minor.patch", () => {
  expectEquivalent('sv <= "v12"', { sv: "12.0.0" }, true);
  expectEquivalent('sv <= "v12"', { sv: "12.0.1" }, false);
  expectEquivalent('sv == "13.0.0"', { sv: "13.0" }, true);
  expectEquivalent('sv == "v1.0.0"', { sv: "1.0.0" }, true);
});

test("bare integer strings are not versions", () => {
  expectEquivalent('sv == "13.0.0"', { sv: "13" }, false);
  expectEquivalent("s > 4", { s: "10" }, true);
});

test("invalid versions do not throw and do not match inequalities", () => {
  expectEquivalent('sv >= "13.0.0"', { sv: "abc" }, false);
  expectEquivalent('sv == "13.0.0"', { sv: "" }, false);
  expectEquivalent('sv == "13.0.0"', { sv: "abc" }, false);
  expectEquivalent('sv != "13.0.0"', { sv: "abc" }, true);
  expectEquivalent('sv >= "13.0.0"', { sv: null }, false);
});

test("plain numbers are not coerced into versions", () => {
  expectEquivalent('s >= "1.0.0"', { s: 2 }, false);
  expectEquivalent('s == "1.0.0"', { s: 2 }, false);
  expectEquivalent("s == 2", { s: 2 }, true);
});
