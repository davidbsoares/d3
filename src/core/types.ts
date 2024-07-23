/* eslint-disable  @typescript-eslint/no-explicit-any */

export const isNumber = (value: any) => typeof value === "number";
export const isString = (value: any) => typeof value === "string";
export const isArray = (value: any) => Array.isArray(value);
export const isFunction = (func:any) => func instanceof Function;
export const isObject = (obj :any) => typeof obj === "object" && !Array.isArray(obj) && obj !== null;
export const isNull = (v: any) => v === null;