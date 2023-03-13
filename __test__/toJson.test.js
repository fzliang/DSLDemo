let { runJson, toJson } = require("../dist/bundle.js");

const json = toJson(
  '(s == "ios" && sv >= "13.0.0") || (s == "android" && sv >= "8.0.0" && sv <= "v12")'
);

console.log(json)

test("test || before lt false)", () => {
  expect(runJson(json, { s: "ios", sv: "8.0.1" })).toBe(false);
});

test("test || before gte true)", () => {
  expect(runJson(json, { s: "ios", sv: "13.0.0" })).toBe(true);
});

test("test || before gte true)", () => {
  expect(runJson(json, { s: "ios", sv: "14.0.0" })).toBe(true);
});

test("test || after gte true)", () => {
  expect(runJson(json, { s: "android", sv: "8.0.0" })).toBe(true);
});

test("test || after gt true)", () => {
  expect(runJson(json, { s: "android", sv: "8.0.1" })).toBe(true);
});

test("test || after lt true)", () => {
  expect(runJson(json, { s: "android", sv: "11.0.1" })).toBe(true);
});

test("test || after lte true)", () => {
  expect(runJson(json, { s: "android", sv: "12.0.0" })).toBe(true);
});

test("test || after lt false)", () => {
  expect(runJson(json, { s: "android", sv: "12.0.1" })).toBe(false);
});
