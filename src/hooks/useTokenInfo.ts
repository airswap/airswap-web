import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import { AppTokenInfo } from "../entities/AppTokenInfo/AppTokenInfo";
import { selectAllTokenInfo } from "../features/metadata/metadataSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";

const useTokenInfo = (
  tokenAddress?: string,
  tokenId?: string
): AppTokenInfo | null => {
  const activeTokens = useAppSelector(selectAllTokenInfo);
  const { chainId } = useAppSelector((state) => state.web3);

  return useMemo(() => {
    if (!tokenAddress || !chainId) {
      return null;
    }

    return findEthOrTokenByAddress(
      tokenAddress,
      activeTokens,
      chainId,
      tokenId
    );
  }, [activeTokens, tokenAddress, chainId, tokenId]);
};

export default useTokenInfo;
