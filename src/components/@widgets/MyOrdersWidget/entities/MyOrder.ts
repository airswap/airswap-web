import { AppTokenInfo } from "../../../../entities/AppTokenInfo/AppTokenInfo";
import { OrderStatus } from "../../../../types/orderStatus";

export interface MyOrder {
  id: string;
  isLoading?: boolean;
  chainId: number;
  senderToken?: AppTokenInfo;
  senderAmount: string;
  senderFilledAmount?: string;
  signerToken?: AppTokenInfo;
  signerAmount: string;
  status: OrderStatus;
  expiry: Date;
  link: string;
}
