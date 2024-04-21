import { Pricing } from "@airswap/utils";

import { ExtendedPricing } from "./ExtendedPricing";

export const transformToExtendedPricing = (
  pricing: Pricing,
  locator: string,
  isLastLook?: boolean
): ExtendedPricing => ({
  ...pricing,
  ...(isLastLook && { isLastLook }),
  locator,
});
