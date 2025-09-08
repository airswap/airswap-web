import { ADDRESS_ZERO } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

import { AppTokenInfo } from "../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenId,
  isCollectionTokenInfo,
} from "../entities/AppTokenInfo/AppTokenInfoHelpers";
import { BalancesState } from "../features/balances/balancesSlice";
import stringToSignificantDecimals from "./stringToSignificantDecimals";

const getTokenMaxAmount = (
  balances: BalancesState,
  baseTokenInfo: AppTokenInfo,
  protocolFeePercentage?: number,
  swapTransactionCost = "0"
): string | null => {
  const { address } = baseTokenInfo;
  const tokenId = getTokenId(baseTokenInfo);

  if (!balances.values[tokenId] || balances.values[tokenId] === "0") {
    return null;
  }

  if (isCollectionTokenInfo(baseTokenInfo)) {
    return balances.values[tokenId];
  }

  const transactionFee =
    baseTokenInfo.address === ADDRESS_ZERO && swapTransactionCost;

  let totalAmount = new BigNumber(balances.values[address] || "0").div(
    10 ** baseTokenInfo.decimals
  );

  if (protocolFeePercentage) {
    totalAmount = totalAmount.minus(
      totalAmount.multipliedBy(protocolFeePercentage)
    );
  }

  if (transactionFee) {
    const usable = totalAmount.minus(transactionFee);
    totalAmount = usable.gt(0) ? usable : new BigNumber("0");
  }

  return stringToSignificantDecimals(totalAmount.toString(), 10);
};

export default getTokenMaxAmount;
