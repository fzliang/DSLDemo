# DSLDemo

## 用途
一种动态下发版本匹配规则的方法。同一条规则经 AST 与 JSON 两条路径求值结果一致。

## 语义

- `==` / `!=` 在两边都是版本时走 semver，否则用 JS 宽松比较。`===` / `!==` 不做 semver。
- 版本：`semver.valid()` 的完整版本（保留 prerelease），以及 `v12` / `13.0` 这种带 `v` 或小数点的简写（补成 `x.y.z`）。裸整数 `"13"`、数字、空串、非法串不是版本；与版本混比时 `==` / 不等式为 false，`!=` 为 true，不抛异常。
- 缺变量抛错。`&&` / `||` 的结果是 boolean。
- 解析必须消耗到 EOF，空白含 tab / 换行。

## 使用方式
build 命令：`npm run build`（`npm test` 会先 build 再跑测试）

```js
let { compile, fromJSON, runDSL } = require("./dist/bundle.js");

const dsl =
  '(s == "ios" && sv >= "13.0.0") || (s == "android" && sv >= "8.0.0" && sv <= "v12")';

const match = compile(dsl);
match({ s: "ios", sv: "13.0.1" });

const restored = fromJSON(match.toJSON());
restored({ s: "android", sv: "12.0.0" });

runDSL(dsl, { s: "ios", sv: "13.0.1" });
```

仍可用 `createParser` / `runAST` / `toJson` / `toJsonObj` / `runJson` / `runJsonObj`；它们共用同一套求值器。
