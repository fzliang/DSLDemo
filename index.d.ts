export type Params = Record<string, unknown>;
export type JsonIR = unknown;

export interface Matcher {
  (params: Params): unknown;
  toJSON(): JsonIR;
}

export function createParser(
  text: string,
  onError?: (message: string) => void
): { parse(): unknown };

export function runAST(ast: unknown, params: Params): unknown;
export function runDSL(dsl: string, params: Params): unknown;
export function toJson(dsl: string): string;
export function toJsonObj(dsl: string): JsonIR;
export function runJson(json: string, params: Params): unknown;
export function runJsonObj(jsonObj: JsonIR, params: Params): unknown;
export function compile(dsl: string): Matcher;
export function fromJSON(json: string | JsonIR): Matcher;
