import { useEffect } from "react";

import { OrderERC20, ProtocolIds, UnsignedOrderERC20 } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricing";
import { PricingErrorType } from "../../errors/pricingError";
import useTokenInfo from "../../hooks/useTokenInfo";
import { selectProtocolFee } from "../metadata/metadataSlice";
import {
  compareOrdersAndSetBestOrder,
  createLastLookUnsignedOrder,
} from "./quotesActions";
import { fetchBestPricing, fetchBestRfqOrder } from "./quotesApi";

interface UseQuotesReturn {
  isLoading: boolean;
  isFailed: boolean;
  bestPricing?: ExtendedPricing;
  bestOrder?: OrderERC20 | UnsignedOrderERC20;
  bestOrderType?: ProtocolIds.RequestForQuoteERC20 | ProtocolIds.LastLookERC20;
  error?: PricingErrorType;
}

const useQuotes = (
  baseToken: string,
  baseTokenAmount: string,
  quoteToken: string,
  isSubmitted: boolean
): UseQuotesReturn => {
  const dispatch = useAppDispatch();
  const { account, chainId, library } = useWeb3React();

  const protocolFee = useAppSelector(selectProtocolFee);
  const {
    isLastLookLoading,
    isRfqLoading,
    bestPricing,
    bestRfqOrder,
    bestLastLookOrder,
    bestOrder,
    bestOrderType,
    lastLookError,
    rfqError,
  } = useAppSelector((state) => state.quotes);

  const isLoading = isLastLookLoading || isRfqLoading;
  const baseTokenInfo = useTokenInfo(baseToken);
  const quoteTokenInfo = useTokenInfo(quoteToken);

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

    dispatch(
      fetchBestPricing({
        provider: library,
        baseToken,
        baseTokenAmount,
        quoteToken,
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
    if (isLoading) {
      return;
    }

    dispatch(compareOrdersAndSetBestOrder(bestRfqOrder, bestLastLookOrder));
  }, [bestRfqOrder, bestLastLookOrder]);

  return {
    isFailed: !isLoading && !!lastLookError && !!rfqError,
    isLoading: isLastLookLoading || isRfqLoading,
    bestPricing,
    bestOrder,
    bestOrderType,
    error: lastLookError || rfqError,
  };
};

export default useQuotes;
