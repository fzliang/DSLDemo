let { runJson, toJson } = require("../dist/bundle.js");

const json = toJson(
  '(s == "ios" && sv >= "13.0.0") || (s == "android" && sv >= "8.0.0" && sv <= "v12")'
);

test("json ios below 13 is false", () => {
  expect(runJson(json, { s: "ios", sv: "8.0.1" })).toBe(false);
});

test("json ios at 13 is true", () => {
  expect(runJson(json, { s: "ios", sv: "13.0.0" })).toBe(true);
});

test("json ios above 13 is true", () => {
  expect(runJson(json, { s: "ios", sv: "14.0.0" })).toBe(true);
});

test("json android at 8 is true", () => {
  expect(runJson(json, { s: "android", sv: "8.0.0" })).toBe(true);
});

test("json android above 8 is true", () => {
  expect(runJson(json, { s: "android", sv: "8.0.1" })).toBe(true);
});

test("json android 11 is true", () => {
  expect(runJson(json, { s: "android", sv: "11.0.1" })).toBe(true);
});

test("json android at 12 is true", () => {
  expect(runJson(json, { s: "android", sv: "12.0.0" })).toBe(true);
});

test("json android above 12 is false", () => {
  expect(runJson(json, { s: "android", sv: "12.0.1" })).toBe(false);
});
