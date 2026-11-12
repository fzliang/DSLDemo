import { createParser } from "./parser";
import { astToJson } from "./toJson";
import { runJsonObj } from "./runJson";

function createMatcher(jsonObj) {
  const matcher = function match(params) {
    return runJsonObj(jsonObj, params);
  };
  matcher.toJSON = () => jsonObj;
  return matcher;
}

export function runAST(ast, params) {
  return runJsonObj(astToJson(ast), params);
}

export function compile(dsl) {
  return createMatcher(astToJson(createParser(dsl).parse()));
}

export function fromJSON(json) {
  const jsonObj = typeof json === "string" ? JSON.parse(json) : json;
  return createMatcher(jsonObj);
}

export function runDSL(dsl, injectParams) {
  return compile(dsl)(injectParams);
}
