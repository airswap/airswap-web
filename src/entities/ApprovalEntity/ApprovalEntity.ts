import { SpenderAddressType } from "../../features/balances/balancesApi";
import { AppTokenInfo } from "../AppTokenInfo/AppTokenInfo";

export type ApprovalEntity = {
  tokenInfo?: AppTokenInfo;
  tokenId: string;
  balance: string;
  allowance: string;
  contract: SpenderAddressType;
};
