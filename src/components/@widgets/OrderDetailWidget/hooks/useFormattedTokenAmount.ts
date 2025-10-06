import { useMemo } from "react";

import { ethers } from "ethers";

const useFormattedTokenAmount = (
  amount?: string,
  decimals?: number
): string => {
  return useMemo(() => {
    if (!amount || decimals === undefined) {
      return "0";
    }

    return ethers.utils.formatUnits(amount, decimals);
  }, [amount, decimals]);
};

export default useFormattedTokenAmount;
