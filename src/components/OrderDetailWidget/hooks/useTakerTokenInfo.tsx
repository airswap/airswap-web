import { useMemo } from "react";

import { TokenInfo } from "@uniswap/token-lists";

import { useAppSelector } from "../../../app/hooks";
import { selectAllTokenInfo } from "../../../features/metadata/metadataSlice";
import { selectTakeOtcReducer } from "../../../features/takeOtc/takeOtcSlice";
import findEthOrTokenByAddress from "../../../helpers/findEthOrTokenByAddress";

// OTC Taker version of useTokenInfo. Look at chainId of the active FullOrderERC20 instead
// of active wallet chainId. This way we don't need to connect a wallet to show order tokens.

const useTakerTokenInfo = (token: string | null): TokenInfo | null => {
  const allTokens = useAppSelector(selectAllTokenInfo);
  const { activeOrder } = useAppSelector(selectTakeOtcReducer);
  const chainId = useMemo(
    () => (activeOrder ? parseInt(activeOrder.chainId) : undefined),
    [activeOrder]
  );

  return useMemo(() => {
    if (!token || !chainId) {
      return null;
    }

    return findEthOrTokenByAddress(token, allTokens, chainId);
  }, [allTokens, token, chainId]);
};

export default useTakerTokenInfo;
