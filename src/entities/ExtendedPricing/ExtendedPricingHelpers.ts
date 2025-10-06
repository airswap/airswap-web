import { getCostByLevels, Pricing } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

import { PricingErrorType } from "../../errors/pricingError";
import { compareAddresses } from "../../helpers/string";
import { isLevels } from "../Pricing/PricingHelpers";
import { ExtendedPricing } from "./ExtendedPricing";
import { transformToExtendedPricing } from "./ExtendedPricingTransformers";

export const isExtendedPricing = (value: any): value is ExtendedPricing =>
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
      return PricingErrorType.belowMinimumAmount;
    }
  }

  // NOTE: this can throw if requested amount exceeds available.
  return getCostByLevels(signerAmount.toString(), levels);
};

export const getBestPricing = (
  pricings: ExtendedPricing[],
  baseTokenAmount: string,
  protocolFee: number
): ExtendedPricing | PricingErrorType => {
  const quoteAmounts = pricings.map((pricing) =>
    getPricingQuoteAmount(pricing, baseTokenAmount, protocolFee)
  );

  // If all pricings are errors, return the first error
  if (quoteAmounts.every((quoteAmount) => quoteAmount in PricingErrorType)) {
    return quoteAmounts.find(
      (quoteAmount) => quoteAmount in PricingErrorType
    ) as PricingErrorType;
  }

  const highestQuoteIndex = quoteAmounts
    .filter((quoteAmount) => typeof quoteAmount === "string")
    .reduce(
      (maxIndex, current, index, arr) =>
        new BigNumber(arr[maxIndex]).isLessThan(new BigNumber(current))
          ? index
          : maxIndex,
      0
    );

  return pricings[highestQuoteIndex];
};

export const handlePricingErc20Event = (
  resources: Pricing[],
  locator: string,
  serverWallet: string | null,
  baseToken: string,
  baseTokenAmount: string,
  quoteToken: string,
  protocolFee: number
): ExtendedPricing | PricingErrorType => {
  const pricings = resources
    .map((pricing) =>
      transformToExtendedPricing(pricing, locator, serverWallet)
    )
    .filter((pricing) => {
      return (
        compareAddresses(pricing.baseToken, baseToken) &&
        compareAddresses(pricing.quoteToken, quoteToken)
      );
    });

  return getBestPricing(pricings, baseTokenAmount, protocolFee);
};
