import { BigNumber } from "bignumber.js";
import { formatUnits } from "ethers/lib/utils";

import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import { getTokenDecimals } from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import toRoundedAtomicString from "../../../helpers/toRoundedAtomicString";

export const getTotalNeededAllowance = (
  orderAmount: string,
  totalTokenAllowance: string,
  tokenInfo: AppTokenInfo
) => {
  const tokenDecimals = tokenInfo ? getTokenDecimals(tokenInfo) : 0;
  const tokenAmount =
    tokenInfo && orderAmount && tokenDecimals
      ? toRoundedAtomicString(orderAmount, tokenDecimals)
      : "0";
  const totalNeededAllowance = new BigNumber(totalTokenAllowance || "0")
    .plus(tokenAmount)
    .toString();

  return formatUnits(totalNeededAllowance, tokenDecimals);
};
