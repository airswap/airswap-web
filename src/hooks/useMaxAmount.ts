import { useMemo } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../app/hooks";
import { selectBalances } from "../features/balances/balancesSlice";
import { selectActiveTokens } from "../features/metadata/metadataSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";
import getTokenMaxAmount from "../helpers/getTokenMaxAmount";

const useMaxAmount = (token: string | null): string | null => {
  const balances = useAppSelector(selectBalances);
  const activeTokens = useAppSelector(selectActiveTokens);
  const { chainId } = useWeb3React<Web3Provider>();

  return useMemo(() => {
    if (!token || !balances || !chainId) {
      return null;
    }

    const tokenInfo = findEthOrTokenByAddress(token, activeTokens, chainId);
    return getTokenMaxAmount(token, balances, tokenInfo);
  }, [activeTokens, token, balances, chainId]);
};

export default useMaxAmount;
