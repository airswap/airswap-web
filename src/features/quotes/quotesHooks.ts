import { useEffect } from "react";

import { OrderERC20, UnsignedOrderERC20 } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricing";
import { PricingErrorType } from "../../errors/pricingError";
import useTokenInfo from "../../hooks/useTokenInfo";
import { selectProtocolFee } from "../metadata/metadataSlice";
import { createLastLookUnsignedOrder } from "./quotesActions";
import { fetchBestPricing, fetchBestRfqOrder } from "./quotesApi";

interface UseQuotesReturn {
  isLoading: boolean;
  isFailed: boolean;
  bestPricing?: ExtendedPricing;
  bestOrder?: OrderERC20 | UnsignedOrderERC20;
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
  const { isFailed, isLoading, bestPricing, bestOrder } = useAppSelector(
    (state) => state.quotes
  );

  const baseTokenInfo = useTokenInfo(baseToken);
  const quoteTokenInfo = useTokenInfo(quoteToken);

  useEffect(() => {
    if (!chainId || !library || !isSubmitted) {
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

    if (!bestPricing.isLastLook) {
      dispatch(
        fetchBestRfqOrder({
          provider: library,
          baseTokenAmount,
          baseTokenDecimals: baseTokenInfo.decimals,
          chainId,
          pricing: bestPricing,
          senderWallet: account,
        })
      );

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
    console.log(bestOrder);
  }, [bestOrder]);

  return {
    bestPricing,
    bestOrder,
    isFailed,
    isLoading,
  };
};

export default useQuotes;
