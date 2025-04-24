import { useMemo } from "react";

import { TokenKinds } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import { selectProtocolFee } from "../features/metadata/metadataSlice";
import toMaxAllowedDecimalsNumberString from "../helpers/toMaxAllowedDecimalsNumberString";

export const useAmountPlusFee = (
  amount?: string,
  tokenDecimals?: number,
  tokenKind?: TokenKinds
): string => {
  const protocolFee = useAppSelector(selectProtocolFee);

  return useMemo(() => {
    if (!amount) {
      return "0";
    }

    if (tokenKind === TokenKinds.ERC721 || tokenKind === TokenKinds.ERC1155) {
      return amount;
    }

    if (!tokenDecimals) {
      return "0";
    }

    const amountPlusFee = new BigNumber(amount)
      .multipliedBy(1 + protocolFee / 10000)
      .toString();

    return toMaxAllowedDecimalsNumberString(amountPlusFee, tokenDecimals);
  }, [amount, protocolFee, tokenDecimals, tokenKind]);
};
