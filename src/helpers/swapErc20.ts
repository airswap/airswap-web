import { SwapERC20 } from "@airswap/libraries";
import { OrderERC20, orderERC20ToParams } from "@airswap/utils";

import { ethers } from "ethers";

export const getSwapErc20Contract = (
  providerOrSigner: ethers.providers.Provider | ethers.Signer,
  chainId: number
): ethers.Contract => {
  return SwapERC20.getContract(providerOrSigner, chainId);
};

export const checkSwapErc20Order = async (
  providerOrSigner: ethers.providers.Provider,
  chainId: number,
  senderWallet: string,
  order: OrderERC20
): Promise<string[]> => {
  const contract = getSwapErc20Contract(providerOrSigner, chainId);

  const response = await contract.check(
    senderWallet,
    ...orderERC20ToParams(order)
  );

  return response;
};

export const getSwapErc20Address = (chainId: number): string | undefined => {
  return SwapERC20.getAddress(chainId) || undefined;
};
