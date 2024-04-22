import { Pricing } from "@airswap/utils";

import { ExtendedPricing } from "./ExtendedPricing";

export const transformToExtendedPricing = (
  pricing: Pricing,
  locator: string,
  serverWallet: string | null
): ExtendedPricing => ({
  ...pricing,
  serverWallet,
  locator,
});
