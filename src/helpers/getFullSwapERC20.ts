import { getFullSwapERC20 as airswapGetFullSwapERC20 } from "@airswap/utils";
import { FullSwapERC20 } from "@airswap/utils/build/src/swap-erc20";

import { ethers } from "ethers";

// TODO: Remove this function when this issue is resolved:
// https://github.com/airswap/airswap-protocols/issues/1319

export const getFullSwapERC20 = async (
  nonce: string,
  signerWallet: string,
  feeReceiver: string,
  logs: ethers.providers.Log[]
): Promise<FullSwapERC20 | undefined> => {
  try {
    return await airswapGetFullSwapERC20(
      nonce,
      signerWallet,
      feeReceiver,
      logs
    );
  } catch (error) {
    console.error(
      `[getFullSwapERC20]: Error for transaction with nonce ${nonce}: ${error}`
    );

    return undefined;
  }
};
