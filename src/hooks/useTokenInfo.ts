import { useMemo } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { TokenInfo } from "@uniswap/token-lists";
import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../app/hooks";
import { selectAllTokenInfo } from "../features/metadata/metadataSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";

const useTokenInfo = (token: string | null): TokenInfo | null => {
  const activeTokens = useAppSelector(selectAllTokenInfo);
  const { chainId } = useWeb3React<Web3Provider>();

  return useMemo(() => {
    if (!token || !chainId) {
      return null;
    }

    return findEthOrTokenByAddress(token, activeTokens, chainId);
  }, [activeTokens, token, chainId]);
};

export default useTokenInfo;
