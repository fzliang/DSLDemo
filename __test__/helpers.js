const api = require("../dist/bundle.js");

function expectEquivalent(expr, params, expected) {
  const ast = api.createParser(expr).parse();
  const astResult = api.runAST(ast, params);
  const dslResult = api.runDSL(expr, params);
  const jsonResult = api.runJson(api.toJson(expr), params);
  const jsonObjResult = api.runJsonObj(api.toJsonObj(expr), params);

  expect(astResult).toEqual(expected);
  expect(dslResult).toEqual(expected);
  expect(jsonResult).toEqual(expected);
  expect(jsonObjResult).toEqual(expected);
  expect(api.compile(expr)(params)).toEqual(expected);
}

function expectAllThrow(expr, params, message) {
  const parse = () => api.createParser(expr).parse();
  expect(() => api.runAST(parse(), params)).toThrow(message);
  expect(() => api.runDSL(expr, params)).toThrow(message);
  expect(() => api.runJson(api.toJson(expr), params)).toThrow(message);
  expect(() => api.runJsonObj(api.toJsonObj(expr), params)).toThrow(message);
}

module.exports = { api, expectEquivalent, expectAllThrow };
