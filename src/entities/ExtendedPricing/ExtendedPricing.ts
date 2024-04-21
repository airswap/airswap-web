import { Pricing } from "@airswap/utils";

export type ExtendedPricing = {
  isLastLook?: boolean;
  locator: string;
} & Pricing;
