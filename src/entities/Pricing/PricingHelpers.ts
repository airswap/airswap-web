import { Levels, Pricing } from "@airswap/utils";

export const isPricing = (value: any): value is Pricing =>
  typeof value === "object" && "baseToken" in value && "quoteToken" in value;

export const isLevels = (value: any): value is Levels =>
  typeof value === "object" &&
  Array.isArray(value) &&
  typeof value[0][0] === "string" &&
  typeof value[0][1] === "string";
