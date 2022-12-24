import { useMemo } from "react";

import { BigNumber } from "bignumber.js";

import stringToSignificantDecimals from "../../../helpers/stringToSignificantDecimals";

const useTokensRate = (takerAmount: string, makerAmount: string): string => {
  return useMemo(() => {
    const currentRate = new BigNumber(takerAmount).dividedBy(
      new BigNumber(makerAmount)
    );

    return stringToSignificantDecimals(currentRate.toString(), 4, 7);
  }, [takerAmount, makerAmount]);
};

export default useTokensRate;
