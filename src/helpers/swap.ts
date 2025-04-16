import { Swap, SwapERC20 } from "@airswap/libraries";
import {
  FullOrder,
  isValidFullOrder,
  OrderERC20,
  orderERC20ToParams,
} from "@airswap/utils";

import { ethers } from "ethers";

import { isOrderERC20 } from "../entities/OrderERC20/OrderERC20Helpers";

export const getSwapContract = (
  providerOrSigner: ethers.providers.Provider | ethers.Signer,
  chainId: number
): ethers.Contract => {
  return Swap.getContract(providerOrSigner, chainId);
};

export const checkSwapOrder = async (
  providerOrSigner: ethers.providers.Provider,
  chainId: number,
  senderWallet: string,
  order: OrderERC20
): Promise<string[]> => {
  const contract = getSwapContract(providerOrSigner, chainId);

  if (!isOrderERC20(order)) {
    return [];
  }

  const response = await contract.check(
    senderWallet,
    ...orderERC20ToParams(order)
  );

  return response;
};

export const getSwapErc20Address = (chainId: number): string | undefined => {
  return SwapERC20.getAddress(chainId) || undefined;
};
