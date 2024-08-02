import { useMemo } from "react";

import { TokenInfo } from "@airswap/utils";

import { useAppSelector } from "../app/hooks";
import { selectAllTokenInfo } from "../features/metadata/metadataSlice";
import getWethAddress from "../helpers/getWethAddress";

const useNativeWrappedToken = (chainId?: number): TokenInfo | null => {
  const allTokens = useAppSelector(selectAllTokenInfo);

  return useMemo(() => {
    if (!chainId) {
      return null;
    }

    return (
      allTokens.find(
        (tokenInfo) => tokenInfo.address === getWethAddress(chainId)
      ) || null
    );
  }, [allTokens, chainId]);
};

export default useNativeWrappedToken;
