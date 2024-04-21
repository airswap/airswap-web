import { OrderERC20, Signature, UnsignedOrderERC20 } from "@airswap/utils";
import { FullSwapERC20 } from "@airswap/utils/build/src/swap-erc20";

export const transformFullSwapERC20ToOrderERC20 = (
  swap: FullSwapERC20,
  nonce: string,
  signature: Signature = { v: "", r: "", s: "" }
): OrderERC20 => {
  return {
    nonce,
    expiry: Math.round(+nonce / 1000).toString(),
    signerWallet: swap.signerWallet,
    signerToken: swap.signerToken,
    signerAmount: swap.signerAmount,
    senderToken: swap.senderToken,
    senderAmount: swap.senderAmount,
    ...signature,
  };
};

export const transformUnsignedOrderERC20ToOrderERC20 = (
  unsignedOrder: UnsignedOrderERC20,
  signature: Signature
): OrderERC20 => {
  return {
    expiry: unsignedOrder.expiry,
    nonce: unsignedOrder.nonce,
    senderToken: unsignedOrder.senderToken,
    senderAmount: unsignedOrder.senderAmount,
    signerWallet: unsignedOrder.signerWallet,
    signerToken: unsignedOrder.signerToken,
    signerAmount: unsignedOrder.signerAmount,
    ...signature,
  };
};
