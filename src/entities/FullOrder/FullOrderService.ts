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
  provider: ethers.providers.BaseProvider
): Promise<ContractTransaction> => {
  return Swap.getContract(provider, provider.network.chainId).cancel([
    order.nonce,
  ]);
};
