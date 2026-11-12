import { evaluate } from "./eval";

export function runJson(json, params) {
  return evaluate(JSON.parse(json), params);
}

export function runJsonObj(jsonObj, params) {
  return evaluate(jsonObj, params);
}
