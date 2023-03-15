# DSLDemo

## 用途
一种动态下发版本匹配规则的方法

## 使用方式
build命令：`npm run build`

```js
let {
  createParser,
  runAST,
  toJson,
  toJsonObj,
  runJson,
  runJsonObj,
} = require("./dist/bundle.js");

const dsl =
  '(s == "ios" && sv >= "13.0.0") || (s == "android" && sv >= "8.0.0" && sv <= "v12")';
console.log(dsl);

ast = createParser(dsl).parse();
runAST(ast, { s: "ios", sv: "13.0.1" });

const json = toJson(dsl);
runJson(json, { s: "ios", sv: "13.0.1" });

const jsonObj = toJsonObj(dsl);
runJsonObj(jsonObj, { s: "ios", sv: "13.0.1" });
```
