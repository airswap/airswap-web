import { calculateCostFromLevels, Pricing } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

import { PricingErrorType } from "../../errors/pricingError";
import { isLevels } from "../Pricing/PricingHelpers";

export const isExtendedPricing = (value: any): value is Pricing =>
  typeof value === "object" &&
  "baseToken" in value &&
  "quoteToken" in value &&
  "locator" in value;

export const getPricingQuoteAmount = (
  pricing: Pricing,
  baseAmount: string,
  protocolFee: number
): string | PricingErrorType => {
  const levels = pricing.bid;
  console.log(levels);
  if (!isLevels(levels)) {
    console.error(
      "[getPricingQuoteAmount] Formulaic pricing not yet supported"
    );

    return PricingErrorType.formulaicPricingNotSupported;
  }

  const signerAmount = new BigNumber(baseAmount).dividedBy(
    1 + protocolFee / 10000
  );

  if (pricing.minimum) {
    if (signerAmount.isLessThan(pricing.minimum)) {
      console.error("[getPricingQuoteAmount] Amount too low");

      return PricingErrorType.belowMinimumAmount;
    }
  }

  // NOTE: this can throw if requested amount exceeds available.
  return calculateCostFromLevels(signerAmount.toString(), levels);
};
