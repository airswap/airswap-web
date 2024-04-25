import { useEffect } from "react";

import { OrderERC20, ProtocolIds, UnsignedOrderERC20 } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricing";
import { PricingErrorType } from "../../errors/pricingError";
import useGasPriceSubscriber from "../../hooks/useReferencePriceSubscriber";
import useTokenInfo from "../../hooks/useTokenInfo";
import { selectProtocolFee } from "../metadata/metadataSlice";
import { selectTradeTerms } from "../tradeTerms/tradeTermsSlice";
import useQuotesDebug from "./hooks/useQuotesDebug";
import {
  compareOrdersAndSetBestOrder,
  createLastLookUnsignedOrder,
} from "./quotesActions";
import { fetchBestPricing, fetchBestRfqOrder } from "./quotesApi";
import { reset } from "./quotesSlice";

interface UseQuotesReturn {
  isLoading: boolean;
  isFailed: boolean;
  bestPricing?: ExtendedPricing;
  bestOrder?: OrderERC20 | UnsignedOrderERC20;
  bestOrderType?: ProtocolIds.RequestForQuoteERC20 | ProtocolIds.LastLookERC20;
  bestQuote?: string;
  error?: PricingErrorType;
}

const useQuotes = (isSubmitted: boolean): UseQuotesReturn => {
  const dispatch = useAppDispatch();
  const { account, chainId, library } = useWeb3React();

  useQuotesDebug();

  const {
    baseToken,
    baseAmount: baseTokenAmount,
    quoteToken,
  } = useAppSelector(selectTradeTerms);
  const protocolFee = useAppSelector(selectProtocolFee);
  const {
    disableLastLook,
    disableRfq,
    isLastLookLoading,
    isRfqLoading,
    bestPricing,
    bestRfqOrder,
    bestLastLookOrder,
    bestOrder,
    bestOrderType,
    bestQuote,
    lastLookError,
    rfqError,
  } = useAppSelector((state) => state.quotes);

  const isLoading = isLastLookLoading || isRfqLoading;
  const baseTokenInfo = useTokenInfo(baseToken.address);
  const quoteTokenInfo = useTokenInfo(quoteToken.address);
  const error =
    !isLoading && !bestOrder ? lastLookError || rfqError : undefined;

  useEffect(() => {
    if (
      !chainId ||
      !library ||
      !isSubmitted ||
      !baseTokenInfo ||
      !quoteTokenInfo ||
      !account
    ) {
      return;
    }

    if (!isSubmitted) {
      dispatch(reset());

      return;
    }

    dispatch(
      fetchBestPricing({
        provider: library,
        baseToken: baseToken.address,
        baseTokenAmount,
        quoteToken: quoteToken.address,
        chainId: chainId,
        protocolFee,
      })
    );

    dispatch(
      fetchBestRfqOrder({
        provider: library,
        baseTokenAmount,
        baseToken: baseTokenInfo,
        chainId,
        quoteToken: quoteTokenInfo,
        senderWallet: account,
      })
    );
  }, [isSubmitted]);

  useEffect(() => {
    if (
      !chainId ||
      !library ||
      !account ||
      !bestPricing ||
      !baseTokenInfo ||
      !quoteTokenInfo
    ) {
      return;
    }

    dispatch(
      createLastLookUnsignedOrder({
        account,
        baseToken: baseTokenInfo,
        baseAmount: baseTokenAmount,
        pricing: bestPricing,
        protocolFee,
        quoteToken: quoteTokenInfo,
      })
    );
  }, [bestPricing]);

  useEffect(() => {
    if (isLoading || !quoteTokenInfo) {
      return;
    }

    dispatch(
      compareOrdersAndSetBestOrder(
        quoteTokenInfo,
        disableLastLook ? undefined : bestLastLookOrder,
        disableRfq ? undefined : bestRfqOrder
      )
    );
  }, [disableLastLook, disableRfq, bestLastLookOrder, bestRfqOrder]);

  if (!isSubmitted) {
    return {
      isFailed: false,
      isLoading: false,
    };
  }

  return {
    isFailed: !isLoading && !!error,
    isLoading: isLastLookLoading || isRfqLoading,
    bestPricing,
    bestOrder,
    bestOrderType,
    bestQuote,
    error,
  };
};

export default useQuotes;
