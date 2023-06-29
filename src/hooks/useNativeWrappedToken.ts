import { useMemo } from "react";

import { WETH } from "@airswap/libraries";
import { TokenInfo } from "@airswap/types";

import { useAppSelector } from "../app/hooks";
import { selectAllTokenInfo } from "../features/metadata/metadataSlice";

const useNativeWrappedToken = (chainId?: number): TokenInfo | null => {
  const allTokens = useAppSelector(selectAllTokenInfo);

  return useMemo(() => {
    if (!chainId) {
      return null;
    }

    return (
      allTokens.find(
        (tokenInfo) =>
          tokenInfo.address === WETH.getAddress(chainId).toLowerCase()
      ) || null
    );
  }, [allTokens, chainId]);
};

export default useNativeWrappedToken;
