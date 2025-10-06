import { Swap } from "@airswap/libraries";
import { FullOrder } from "@airswap/utils";

import { ContractTransaction, ethers } from "ethers";

export const getFullOrderNonceUsed = async (
  order: FullOrder,
  provider: ethers.providers.BaseProvider
) => {
  return Swap.getContract(provider, order.chainId).nonceUsed(
    order.signer.wallet,
    order.nonce
  );
};

export const cancelFullOrder = async (
  order: FullOrder,
  library: ethers.providers.Web3Provider
): Promise<ContractTransaction> => {
  const signer = library.getSigner();
  return Swap.getContract(signer, library.network.chainId).cancel([
    order.nonce,
  ]);
};
