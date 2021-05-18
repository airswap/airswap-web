import { useEffect, useState } from "react";
import { TokenInfo } from "@uniswap/token-lists";
import { getSavedTokenSetInfo } from "../features/balances/balancesApi";

const useTokenSetInfo = (chainId?: number) => {
  const [tokenSetInfo, setTokenSetInfo] = useState<TokenInfo[]>([]);
  useEffect(() => {
    if (!chainId) {
      setTokenSetInfo([]);
    } else {
      getSavedTokenSetInfo(chainId).then((tokenSetInfo) => {
        setTokenSetInfo(tokenSetInfo);
      });
    }
  }, [chainId]);

  return tokenSetInfo;
};

export default useTokenSetInfo;
