import { useMemo } from "react";

import { ethers } from "ethers";

const useFormattedTokenAmount = (
  amount?: string,
  decimals?: number
): string | undefined => {
  return useMemo(() => {
    if (!amount || !decimals) {
      return undefined;
    }

    return ethers.utils.formatUnits(amount, decimals);
  }, [amount, decimals]);
};

export default useFormattedTokenAmount;
