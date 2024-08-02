import { TokenInfo } from "@airswap/utils";

import nativeCurrency from "../constants/nativeCurrency";

const useNativeToken = (chainId?: number): TokenInfo => {
  return nativeCurrency[chainId || 1] as TokenInfo;
};

export default useNativeToken;
