import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import { selectBalances } from "../features/balances/balancesSlice";
import {
  selectActiveTokens,
  selectProtocolFee,
} from "../features/metadata/metadataSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";
import getTokenMaxAmount from "../helpers/getTokenMaxAmount";

const useMaxAmount = (
  token: string | null,
  deductProtocolFee = false
): string | null => {
  const balances = useAppSelector(selectBalances);
  const activeTokens = useAppSelector(selectActiveTokens);
  const protocolFee = useAppSelector(selectProtocolFee);
  const { chainId } = useAppSelector((state) => state.web3);

  return useMemo(() => {
    if (!token || !balances || !chainId) {
      return null;
    }

    const tokenInfo = findEthOrTokenByAddress(token, activeTokens, chainId);

    if (!tokenInfo) {
      return null;
    }

    return getTokenMaxAmount(
      token,
      balances,
      tokenInfo,
      deductProtocolFee ? protocolFee / 10000 : undefined
    );
  }, [activeTokens, token, balances, protocolFee, deductProtocolFee, chainId]);
};

export default useMaxAmount;
