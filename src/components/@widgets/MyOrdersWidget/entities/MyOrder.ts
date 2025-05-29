import { AppTokenInfo } from "../../../../entities/AppTokenInfo/AppTokenInfo";
import { OrderStatus } from "../../../../types/orderStatus";

export interface MyOrder {
  id: string;
  type: "full" | "fullERC20" | "delegate";
  hasAllowanceWarning?: boolean;
  isLoading?: boolean;
  chainId: number;
  for: string;
  senderToken?: AppTokenInfo;
  senderAmount: string;
  senderFilledAmount?: string;
  signerToken?: AppTokenInfo;
  signerAmount: string;
  status: OrderStatus;
  expiry: Date;
  link: string;
}
