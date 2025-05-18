import { SpenderAddressType } from "../../features/balances/balancesApi";
import { BalancesState } from "../../features/balances/balancesSlice";
import { Allowances } from "../../features/balances/balancesTypes";
import { AppTokenInfo } from "../AppTokenInfo/AppTokenInfo";
import {
  findTokenByAddressAndId,
  splitTokenIdentifier,
} from "../AppTokenInfo/AppTokenInfoHelpers";
import { ApprovalEntity } from "./ApprovalEntity";

export type AllowanceKey = keyof Allowances;

type AllowanceMap = {
  [K in AllowanceKey]: SpenderAddressType;
};

const allowanceMap: AllowanceMap = {
  swap: "Swap",
  swapERC20: "SwapERC20",
  wrapper: "Wrapper",
  delegate: "Delegate",
};

const transformAllowanceToApprovalEntities = (
  allowance: BalancesState,
  balances: BalancesState,
  contract: SpenderAddressType,
  tokens: AppTokenInfo[]
): ApprovalEntity[] => {
  return Object.keys(allowance.values)
    .filter((tokenId) => allowance.values[tokenId] !== "0")
    .map((tokenId) => {
      const { address, id } = splitTokenIdentifier(tokenId);
      const token = findTokenByAddressAndId(tokens, address, id);

      return {
        tokenId,
        balance: balances.values[tokenId] || "0",
        allowance: allowance.values[tokenId] || "0",
        contract,
        tokenInfo: token,
      };
    });
};

export const transformAllowancesToApprovalEntities = (
  allowances: Allowances,
  balances: BalancesState,
  tokens: AppTokenInfo[]
): ApprovalEntity[] => {
  return Object.keys(allowances)
    .map((key) => {
      const allowance = allowances[key as AllowanceKey];

      if (!allowance) {
        return [];
      }

      const contract = allowanceMap[key as AllowanceKey];

      return transformAllowanceToApprovalEntities(
        allowance,
        balances,
        contract,
        tokens
      );
    })
    .flat()
    .filter((approval) => approval.balance !== "0");
};
