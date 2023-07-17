import { useMemo } from "react";

import { WETH } from "@airswap/libraries";
import { TokenInfo } from "@airswap/types";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import nativeCurrency from "../constants/nativeCurrency";
import getWethAddress from "../helpers/getWethAddress";
import { SwapType } from "../types/swapType";

const useSwapType = (
  token1: TokenInfo | null,
  token2: TokenInfo | null
): SwapType => {
  const { chainId } = useWeb3React<Web3Provider>();

  return useMemo(() => {
    if (!chainId || !token1 || !token2) {
      return "swap";
    }

    const eth = nativeCurrency[chainId].address;
    const weth = getWethAddress(chainId);

    if (
      [weth, eth].includes(token1.address) &&
      [weth, eth].includes(token2.address)
    ) {
      return "wrapOrUnwrap";
    }

    if ([token1.address, token2.address].includes(eth)) {
      return "swapWithWrap";
    }

    return "swap";
  }, [chainId, token1, token2]);
};

export default useSwapType;
