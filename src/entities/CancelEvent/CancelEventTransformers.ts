import { CancelEvent } from "./CancelEvent";

export const transformToCancelEvent = (
  hash: string,
  nonce: string,
  signerAddress: string,
  status?: number
): CancelEvent => {
  return {
    name: "Cancel",
    hash,
    nonce,
    signerAddress,
    status,
  };
};
