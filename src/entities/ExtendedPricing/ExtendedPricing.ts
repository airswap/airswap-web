import { Pricing } from "@airswap/utils";

export type ExtendedPricing = {
  locator: string;
  serverWallet: string | null;
} & Pricing;
