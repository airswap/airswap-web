import { Pricing } from "@airswap/utils";

export type ExtendedPricing = {
  isLastLook?: boolean;
  locator: string;
  serverWallet: string | null;
} & Pricing;
