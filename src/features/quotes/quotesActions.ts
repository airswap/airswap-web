import {
  createOrderERC20,
  OrderERC20,
  ProtocolIds,
  TokenInfo,
  UnsignedOrderERC20,
} from "@airswap/utils";
import { formatUnits } from "@ethersproject/units";

import { BigNumber } from "bignumber.js";

import { AppDispatch } from "../../app/store";
import { LAST_LOOK_ORDER_EXPIRY_SEC } from "../../constants/configParams";
import { ExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricing";
import { getPricingQuoteAmount } from "../../entities/ExtendedPricing/ExtendedPricingHelpers";
import { setBestLastLookOrder, setBestOrder } from "./quotesSlice";

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
      // .dividedBy(1 + protocolFee / 10000)
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

    dispatch(setBestLastLookOrder(unsignedOrder));
  };

export const compareOrdersAndSetBestOrder =
  (
    token: TokenInfo,
    rfqOrder?: OrderERC20,
    lastLookOrder?: UnsignedOrderERC20
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    const rfqQuote = rfqOrder
      ? formatUnits(rfqOrder.signerAmount, token.decimals)
      : undefined;
    const lastLookQuote = lastLookOrder
      ? formatUnits(lastLookOrder.senderAmount, token.decimals)
      : undefined;

    if (!rfqOrder && !lastLookOrder) {
      console.error("[compareOrdersAndSetBestOrder] No orders to compare");

      return;
    }

    if (!rfqOrder) {
      dispatch(
        setBestOrder({
          order: lastLookOrder!,
          type: ProtocolIds.LastLookERC20,
          quote: lastLookQuote!,
        })
      );

      return;
    }

    if (!lastLookOrder) {
      dispatch(
        setBestOrder({
          order: rfqOrder,
          type: ProtocolIds.RequestForQuoteERC20,
          quote: rfqQuote!,
        })
      );

      return;
    }

    if (
      new BigNumber(lastLookOrder.senderAmount).lte(
        new BigNumber(rfqOrder.signerAmount)
      )
    ) {
      dispatch(
        setBestOrder({
          order: lastLookOrder,
          type: ProtocolIds.LastLookERC20,
          quote: lastLookQuote!,
        })
      );

      return;
    }

    dispatch(
      setBestOrder({
        order: rfqOrder,
        type: ProtocolIds.RequestForQuoteERC20,
        quote: rfqQuote!,
      })
    );
  };
