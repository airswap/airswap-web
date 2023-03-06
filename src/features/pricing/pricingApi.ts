import { Formula, Levels, Pricing } from "@airswap/types";
import { calculateCostFromLevels } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

export function pricingIsLevels(value: Levels | Formula): value is Levels {
  return typeof value !== "string";
}

/**
 * Calculates the quote amount from pricing, given a base amount, fee, and
 * pricing.
 */
export const calculateQuoteAmount: (params: {
  baseAmount: string;
  side: "buy" | "sell";
  protocolFee: number;
  pricing: Pricing;
}) => string = ({ baseAmount, side, protocolFee, pricing }) => {
  // baseAmount always known.
  // For a sell, baseAmount is signerAmount.
  // For a buy, baseAmount is senderAmount.

  if (side === "sell") {
    const levels = pricing.bid;
    if (!pricingIsLevels(levels)) {
      throw new Error("formulaic pricing not yet supported");
    }
    const signerAmount = new BigNumber(baseAmount)
      .dividedBy(1.0007)
      // .integerValue(BigNumber.ROUND_CEIL)
      .toString();

    // @ts-ignore - TODO: Fix when types updated
    if (pricing.minimum) {
      // @ts-ignore - TODO: Fix when types updated
      const minimum = new BigNumber(pricing.minimum);
      if (minimum.isGreaterThan(signerAmount)) {
        throw new Error("Amount too low");
      }
    }

    // NOTE: this can throw if requested amount exceeds available.
    const senderAmount = calculateCostFromLevels(
      signerAmount.toString(),
      levels
    );

    return senderAmount;
  } else {
    // buy order.
    const levels = pricing.ask;
    if (!pricingIsLevels(levels)) {
      throw new Error("formulaic pricing not yet supported");
    }
    const senderAmount = baseAmount;
    // Fee comes out of signerAmount, so we need to add it to the quoteAmount
    const signerAmount = new BigNumber(
      calculateCostFromLevels(senderAmount, levels)
    )
      .multipliedBy(1 + protocolFee / 10000)
      // .integerValue(BigNumber.ROUND_FLOOR)
      .toString();
    return signerAmount;
  }
};
