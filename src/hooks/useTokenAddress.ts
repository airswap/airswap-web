import { useMemo } from "react";

import { findTokensBySymbol } from "@airswap/metadata";

import { useAppSelector } from "../app/hooks";
import { selectAllTokenInfo } from "../features/metadata/metadataSlice";

const useTokenAddress = (tokenSymbol: string): string | null => {
  const allTokens = useAppSelector(selectAllTokenInfo);

  return useMemo(() => {
    if (!allTokens.length) {
      return null;
    }

    return findTokensBySymbol(tokenSymbol, allTokens)[0]?.address || null;
  }, [allTokens, tokenSymbol]);
};

export default useTokenAddress;
