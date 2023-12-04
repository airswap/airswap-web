import { ethers } from "ethers";
import { useMemo } from "react";

const useFormattedTokenAmount = (
  amount?: string,
  decimals?: number,
): string | undefined => {
  return useMemo(() => {
    if (!amount || !decimals) {
      return undefined;
    }

    return ethers.utils.formatUnits(amount, decimals);
  }, [amount, decimals]);
};

export default useFormattedTokenAmount;
