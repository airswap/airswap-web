import { useAppSelector } from "../app/hooks";
import { selectAllTokenInfo } from "../features/metadata/metadataSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";
import { TokenInfo } from "@airswap/types";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";

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
