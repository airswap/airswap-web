import { useMemo } from "react";

import { useAppSelector } from "../../../../app/hooks";
import nativeCurrency from "../../../../constants/nativeCurrency";
import { selectUserTokens } from "../../../../features/userSettings/userSettingsSlice";
import useTokenAddress from "../../../../hooks/useTokenAddress";
import getTokenOrFallback from "../helpers/getTokenOrFallback";

// Hook for checking token pair in SwapWidget

const useTokenOrFallback = (
  tokenFrom?: string,
  tokenTo?: string,
  isFrom?: boolean
): string | null => {
  const userTokens = useAppSelector(selectUserTokens);
  const { chainId } = useAppSelector((state) => state.web3);

  const defaultBaseTokenAddress = useTokenAddress("USDT");
  const defaultQuoteTokenAddress = nativeCurrency[chainId || 1]?.address;

  return useMemo(() => {
    return getTokenOrFallback(
      isFrom ? tokenFrom : tokenTo,
      isFrom ? tokenTo : tokenFrom,
      isFrom ? userTokens.tokenTo : userTokens.tokenFrom,
      isFrom ? defaultBaseTokenAddress : defaultQuoteTokenAddress,
      isFrom ? defaultQuoteTokenAddress : defaultBaseTokenAddress
    );
  }, [
    userTokens,
    tokenFrom,
    tokenTo,
    isFrom,
    defaultBaseTokenAddress,
    defaultQuoteTokenAddress,
  ]);
};

export default useTokenOrFallback;
