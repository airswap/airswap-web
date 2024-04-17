import { ApproveEvent } from "./ApproveEvent";

export const transformToApproveEvent = (
  amount: string,
  hash: string,
  spenderAddress: string,
  tokenAddress: string,
  status?: number
): ApproveEvent => {
  return {
    amount,
    name: "Approve",
    hash,
    spenderAddress,
    tokenAddress,
    status,
  };
};
