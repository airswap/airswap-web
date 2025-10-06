import { useMemo } from "react";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../../../../app/hooks";
import { selectProtocolFee } from "../../../../features/metadata/metadataSlice";

const useCustomSignerAmountPlusFee = (
  tokenExchangeRate: BigNumber,
  senderAmount?: string,
  signerTokenDecimals?: number
) => {
  const protocolFee = useAppSelector(selectProtocolFee);

  return useMemo(() => {
    if (!senderAmount || !signerTokenDecimals) {
      return "0";
    }

    const customSignerAmount = new BigNumber(senderAmount).multipliedBy(
      tokenExchangeRate
    );

    return customSignerAmount
      .multipliedBy(1 + protocolFee / 10000)
      .decimalPlaces(signerTokenDecimals, BigNumber.ROUND_HALF_UP)
      .toString();
  }, [senderAmount, tokenExchangeRate, protocolFee, signerTokenDecimals]);
};

export default useCustomSignerAmountPlusFee;
