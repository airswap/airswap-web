import { formatUnits } from "ethers/lib/utils";

import {
  getTokenDecimals,
  getTokenSymbol,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { ApprovalEntity } from "../../../entities/ApprovalEntity/ApprovalEntity";
import { ApprovalSortType } from "./types";

export const sortApprovalEntities = (
  approvalEntities: ApprovalEntity[],
  sortType: ApprovalSortType,
  isReverse?: boolean
) => {
  const array = [...approvalEntities];

  const sortedArray = array.sort((a, b) => {
    const decimalsA = a.tokenInfo ? getTokenDecimals(a.tokenInfo) : 0;
    const decimalsB = b.tokenInfo ? getTokenDecimals(b.tokenInfo) : 0;

    if (sortType === "token") {
      const aName = a.tokenInfo ? getTokenSymbol(a.tokenInfo) : "";
      const bName = b.tokenInfo ? getTokenSymbol(b.tokenInfo) : "";

      return aName.localeCompare(bName);
    }

    if (sortType === "balance") {
      const formattedBalanceA = formatUnits(a.balance, decimalsA);
      const formattedBalanceB = formatUnits(b.balance, decimalsB);

      return Number(formattedBalanceB) - Number(formattedBalanceA);
    }

    if (sortType === "approval") {
      const formattedAllowanceA = formatUnits(a.allowance, decimalsA);
      const formattedAllowanceB = formatUnits(b.allowance, decimalsB);

      return Number(formattedAllowanceB) - Number(formattedAllowanceA);
    }

    if (sortType === "contract") {
      return a.contract.localeCompare(b.contract);
    }

    return 0;
  });

  if (isReverse) {
    sortedArray.reverse();
  }

  return sortedArray;
};
