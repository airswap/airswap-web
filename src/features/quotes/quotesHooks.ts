import { useEffect, useState } from "react";

import { Server, Wrapper } from "@airswap/libraries";
import {
  ADDRESS_ZERO,
  OrderERC20,
  ProtocolIds,
  TokenInfo,
  UnsignedOrderERC20,
} from "@airswap/utils";
import { noop } from "@react-hookz/web/esnext/util/const";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricing";
import { transformExtendedPricingToUnsignedOrder } from "../../entities/ExtendedPricing/ExtendedPricingTransformers";
import { getOrderExpiryWithBufferInSeconds } from "../../entities/OrderERC20/OrderERC20Helpers";
import { isServer } from "../../entities/Server/ServerHelpers";
import { PricingErrorType } from "../../errors/pricingError";
import useNativeWrappedToken from "../../hooks/useNativeWrappedToken";
import useSwapType from "../../hooks/useSwapType";
import useTokenInfo from "../../hooks/useTokenInfo";
import { SwapType } from "../../types/swapType";
import { ConnectionType } from "../../web3-connectors/connections";
import { getGasPrice } from "../gasCost/gasCostApi";
import { selectProtocolFee } from "../metadata/metadataSlice";
import { selectTradeTerms } from "../tradeTerms/tradeTermsSlice";
import useQuotesDebug from "./hooks/useQuotesDebug";
import {
  compareOrdersAndSetBestOrder,
  subscribePricingERC20,
} from "./quotesActions";
import { fetchBestPricing, fetchBestRfqOrder } from "./quotesApi";
import { reset, setBestLastLookOrder, setDisableLastLook } from "./quotesSlice";

interface UseQuotesValues {
  isLoading: boolean;
  isFailed: boolean;
  bestPricing?: ExtendedPricing;
  bestOrder?: OrderERC20 | UnsignedOrderERC20;
  bestOrderType?: ProtocolIds.RequestForQuoteERC20 | ProtocolIds.LastLookERC20;
  bestQuote?: string;
  error?: PricingErrorType;
}

const useQuotes = (isSubmitted: boolean): UseQuotesValues => {
  const dispatch = useAppDispatch();

  const { provider: library } = useWeb3React();
  const { account, chainId, connectionType } = useAppSelector(
    (state) => state.web3
  );
  const {
    baseToken,
    baseAmount: baseTokenAmount,
    quoteToken,
  } = useAppSelector(selectTradeTerms);
  const protocolFee = useAppSelector(selectProtocolFee);
  const {
    isLoading: isGasCostLoading,
    isSuccessful: isGasCostSuccessful,
    swapTransactionCost,
  } = useAppSelector((state) => state.gasCost);
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
    streamedBestPricing,
    streamedLastLookOrder,
  } = useAppSelector((state) => state.quotes);

  const isLoading = isLastLookLoading || isRfqLoading || isGasCostLoading;
  const baseTokenInfo = useTokenInfo(baseToken.address) as TokenInfo;
  const quoteTokenInfo = useTokenInfo(quoteToken.address) as TokenInfo;
  const wrappedTokenInfo = useNativeWrappedToken(chainId);

  const error =
    !isLoading && !bestOrder ? lastLookError || rfqError : undefined;

  const [fetchCount, setFetchCount] = useState(0);

  const swapType = useSwapType(baseTokenInfo, quoteTokenInfo);
  const justifiedBaseTokenInfo =
    swapType === SwapType.swapWithWrap ? wrappedTokenInfo : baseTokenInfo;
  const justifiedQuoteTokenInfo =
    quoteTokenInfo?.address === ADDRESS_ZERO
      ? wrappedTokenInfo
      : quoteTokenInfo;

  useQuotesDebug();

  useEffect(() => {
    setFetchCount(isSubmitted ? 1 : 0);
  }, [isSubmitted]);

  useEffect(() => {
    if (!bestOrder || bestOrderType !== ProtocolIds.RequestForQuoteERC20) {
      return noop;
    }

    const expiry = getOrderExpiryWithBufferInSeconds(bestOrder.expiry);
    const timeout = expiry * 1000 - Date.now();

    const intervalId = setTimeout(() => {
      setFetchCount(fetchCount + 1);
    }, timeout);

    return () => clearInterval(intervalId);
  }, [bestOrder]);

  useEffect(() => {
    if (
      !chainId ||
      !library ||
      !isSubmitted ||
      !justifiedBaseTokenInfo ||
      !justifiedQuoteTokenInfo ||
      !account
    ) {
      return;
    }

    if (!fetchCount) {
      dispatch(reset());

      return;
    }

    dispatch(getGasPrice({ chainId }));

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
        baseToken: justifiedBaseTokenInfo,
        chainId,
        quoteToken: justifiedQuoteTokenInfo,
        senderWallet:
          swapType === SwapType.swapWithWrap
            ? Wrapper.getAddress(chainId)!
            : account,
      })
    );
  }, [fetchCount]);

  useEffect(() => {
    if (
      !chainId ||
      !library ||
      !account ||
      !bestPricing ||
      !justifiedBaseTokenInfo ||
      !justifiedQuoteTokenInfo
    ) {
      return;
    }

    const newLastLookOrder = transformExtendedPricingToUnsignedOrder({
      account,
      baseToken: justifiedBaseTokenInfo,
      baseAmount: baseTokenAmount,
      pricing: bestPricing,
      protocolFee,
      quoteToken: justifiedQuoteTokenInfo,
    });

    dispatch(setBestLastLookOrder(newLastLookOrder));
  }, [bestPricing]);

  useEffect(() => {
    if (
      isLoading ||
      !justifiedQuoteTokenInfo ||
      !isSubmitted ||
      !isGasCostSuccessful
    ) {
      return;
    }

    dispatch(
      compareOrdersAndSetBestOrder(
        justifiedQuoteTokenInfo,
        disableLastLook ? undefined : bestLastLookOrder,
        disableRfq ? undefined : bestRfqOrder,
        swapTransactionCost
      )
    );
  }, [
    isGasCostSuccessful,
    isLoading,
    disableLastLook,
    disableRfq,
    bestLastLookOrder,
    bestRfqOrder,
  ]);

  useEffect(() => {
    if (
      !library ||
      !chainId ||
      !bestPricing ||
      !justifiedBaseTokenInfo ||
      !justifiedQuoteTokenInfo ||
      !account ||
      !isSubmitted ||
      bestOrderType !== ProtocolIds.LastLookERC20
    ) {
      return;
    }

    let server: Server | PricingErrorType;

    const subscribe = async () => {
      // @ts-ignore
      server = await dispatch(
        subscribePricingERC20({
          account,
          baseToken: justifiedBaseTokenInfo,
          baseTokenAmount,
          quoteToken: justifiedQuoteTokenInfo,
          protocolFee,
          bestPricing,
          provider: library,
          chainId,
        })
      );
    };

    subscribe();

    return () => {
      if (isServer(server)) {
        server.unsubscribePricingERC20([
          { baseToken: baseToken.address, quoteToken: quoteToken.address },
        ]);
        server.disconnect();
      }
    };
  }, [bestOrderType, isSubmitted]);

  useEffect(() => {
    // LastLook not working for gnosis provider, I have not been able to find the root cause.
    dispatch(setDisableLastLook(connectionType === ConnectionType.gnosis));
  }, [connectionType]);

  if (swapType === SwapType.wrapOrUnwrap) {
    return {
      isFailed: false,
      isLoading: false,
      ...(isSubmitted && { bestQuote: baseTokenAmount }),
    };
  }

  return {
    isFailed: !isLoading && !!error,
    isLoading: isLastLookLoading || isRfqLoading,
    bestPricing: streamedBestPricing || bestPricing,
    bestOrder: streamedLastLookOrder || bestOrder,
    bestOrderType,
    bestQuote,
    error,
  };
};

export default useQuotes;
