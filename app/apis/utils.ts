export const equalStringOrInArray = (param: string | string[]) =>
  Array.isArray(param) ? "in" : "==";
