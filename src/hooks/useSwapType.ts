import { useMemo } from "react";

import { TokenInfo } from "@airswap/utils";

import { useAppSelector } from "../app/hooks";
import nativeCurrency from "../constants/nativeCurrency";
import getWethAddress from "../helpers/getWethAddress";
import { SwapType } from "../types/swapType";
import useNetworkSupported from "./useNetworkSupported";

const useSwapType = (
  token1: TokenInfo | null,
  token2: TokenInfo | null
): SwapType => {
  const { chainId } = useAppSelector((state) => state.web3);
  const isNetworkSupported = useNetworkSupported();

  return useMemo(() => {
    if (!chainId || !token1 || !token2 || !isNetworkSupported) {
      return SwapType.swap;
    }

    const eth = nativeCurrency[chainId].address;
    const weth = getWethAddress(chainId);

    if (
      [weth, eth].includes(token1.address) &&
      [weth, eth].includes(token2.address)
    ) {
      return SwapType.wrapOrUnwrap;
    }

    if (eth && [token1.address].includes(eth)) {
      return SwapType.swapWithWrap;
    }

    return SwapType.swap;
  }, [chainId, token1, token2, isNetworkSupported]);
};

export default useSwapType;
