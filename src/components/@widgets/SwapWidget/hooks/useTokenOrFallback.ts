import { useMemo } from "react";

import { useAppSelector } from "../../../../app/hooks";
import nativeCurrency from "../../../../constants/nativeCurrency";
import { selectCustomTokenAddresses } from "../../../../features/metadata/metadataSlice";
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
  const customTokens = useAppSelector(selectCustomTokenAddresses);
  const { chainId } = useAppSelector((state) => state.web3);

  const defaultBaseTokenAddress = useTokenAddress("USDT");
  const defaultQuoteTokenAddress = nativeCurrency[chainId || 1]?.address;

  return useMemo(() => {
    return getTokenOrFallback(
      isFrom ? tokenFrom : tokenTo,
      isFrom ? tokenTo : tokenFrom,
      isFrom ? userTokens.tokenFrom : userTokens.tokenTo,
      isFrom ? userTokens.tokenTo : userTokens.tokenFrom,
      isFrom ? defaultBaseTokenAddress : defaultQuoteTokenAddress,
      isFrom ? defaultQuoteTokenAddress : defaultBaseTokenAddress,
      customTokens
    );
  }, [
    userTokens,
    tokenFrom,
    tokenTo,
    isFrom,
    defaultBaseTokenAddress,
    defaultQuoteTokenAddress,
    customTokens,
  ]);
};

export default useTokenOrFallback;
