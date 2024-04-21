import { createOrderERC20, TokenInfo } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

import { AppDispatch } from "../../app/store";
import { LAST_LOOK_ORDER_EXPIRY_SEC } from "../../constants/configParams";
import { ExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricing";
import { getPricingQuoteAmount } from "../../entities/ExtendedPricing/ExtendedPricingHelpers";
import { setBestOrder } from "./quotesSlice";

interface CreateLastLookUnsignedOrder {
  account: string;
  baseToken: TokenInfo;
  baseAmount: string;
  pricing: ExtendedPricing;
  protocolFee: number;
  quoteToken: TokenInfo;
}

export const createLastLookUnsignedOrder =
  (props: CreateLastLookUnsignedOrder) =>
  async (dispatch: AppDispatch): Promise<void> => {
    const { account, baseToken, baseAmount, pricing, protocolFee, quoteToken } =
      props;

    const quoteAmount = getPricingQuoteAmount(pricing, baseAmount, protocolFee);
    const senderWallet = pricing.serverWallet;

    const baseAmountAtomic = new BigNumber(baseAmount)
      .multipliedBy(10 ** baseToken.decimals)
      // Note that we remove the signer fee from the amount that we send.
      // This was already done to determine quoteAmount.
      .dividedBy(1 + protocolFee / 10000)
      .integerValue(BigNumber.ROUND_CEIL)
      .toString();

    const quoteAmountAtomic = new BigNumber(quoteAmount)
      .multipliedBy(10 ** quoteToken.decimals)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toString();

    const unsignedOrder = createOrderERC20({
      expiry: Math.floor(Date.now() / 1000 + LAST_LOOK_ORDER_EXPIRY_SEC),
      nonce: Date.now().toString(),
      senderWallet,
      signerWallet: account,
      signerToken: baseToken.address,
      senderToken: quoteToken.address,
      protocolFee: protocolFee.toString(),
      signerAmount: baseAmountAtomic,
      senderAmount: quoteAmountAtomic,
    });

    dispatch(setBestOrder(unsignedOrder));
  };
