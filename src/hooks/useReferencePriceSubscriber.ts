import { useMemo, useRef } from "react";

import { TokenInfo } from "@airswap/types";

import { providers } from "ethers";

import { useAppDispatch } from "../app/hooks";
import { REFERENCE_PRICE_UPDATE_INTERVAL_MS } from "../constants/configParams";
import {
  getFastGasPrice,
  getPriceOfTokenInWethFromUniswap,
} from "../features/gasCost/gasCostApi";
import {
  setFastGasPrice,
  setTokenPrice,
} from "../features/gasCost/gasCostSlice";

const useGasPriceSubscriber = () => {
  const dispatch = useAppDispatch();

  const intervals = useRef<{
    gas: number | null;
    tokens: Record<string, number>;
  }>({ gas: null, tokens: {} });

  const subscribeToGasPrice = useMemo(
    () => () => {
      if (intervals.current.gas) return;
      const updateGasPrice = async () => {
        try {
          let price = await getFastGasPrice();
          if (price) {
            dispatch(setFastGasPrice(price.toString()));
          }
        } catch (e) {
          console.error(e);
        }
      };
      intervals.current.gas = window.setInterval(
        updateGasPrice,
        REFERENCE_PRICE_UPDATE_INTERVAL_MS
      );
      // also call immediately.
      updateGasPrice();
    },
    [dispatch]
  );

  const unsubscribeFromGasPrice = useMemo(
    () => () => {
      const interval = intervals.current.gas;
      if (interval === null) return;
      clearInterval(interval);
      intervals.current.gas = null;
    },
    []
  );

  const subscribeToTokenPrice = useMemo(
    () => (token: TokenInfo, provider: providers.Provider, chainId: number) => {
      if (intervals.current.tokens[token.address]) return;
      const updateTokenPrice = async () => {
        try {
          const price = await getPriceOfTokenInWethFromUniswap(
            token,
            provider,
            chainId
          );
          dispatch(
            setTokenPrice({
              tokenAddress: token.address,
              tokenPriceInWeth: price.toString(),
            })
          );
        } catch (e: any) {
          console.error(e);
        }
      };
      intervals.current.tokens[token.address] = window.setInterval(
        updateTokenPrice,
        REFERENCE_PRICE_UPDATE_INTERVAL_MS
      );
      updateTokenPrice();
    },
    [dispatch]
  );

  const unsubscribeFromTokenPrice = useMemo(
    () => (token?: TokenInfo) => {
      if (token) {
        const interval = intervals.current.tokens[token.address];
        if (!interval) return;
        window.clearInterval(intervals.current.tokens[token.address]);
        delete intervals.current.tokens[token.address];
      } else {
        // Clear all if no token provided
        Object.keys(intervals.current.tokens).forEach((tokenAddress) => {
          window.clearInterval(intervals.current.tokens[tokenAddress]);
        });
        intervals.current.tokens = {};
      }
    },
    []
  );

  return {
    subscribeToGasPrice,
    unsubscribeFromGasPrice,
    subscribeToTokenPrice,
    unsubscribeFromTokenPrice,
  };
};

export default useGasPriceSubscriber;
