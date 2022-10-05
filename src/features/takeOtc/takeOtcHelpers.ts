import * as SwapContract from "@airswap/swap/build/contracts/Swap.sol/Swap.json";
// @ts-ignore
import * as swapDeploys from "@airswap/swap/deploys";
import { FullOrder } from "@airswap/typescript";

import { ethers, utils, Contract } from "ethers";

const SwapInterface = new utils.Interface(JSON.stringify(SwapContract.abi));

export const getTakenState = async (
  order: FullOrder,
  library: ethers.providers.Web3Provider
) => {
  const SwapContract = new Contract(
    swapDeploys[order.chainId],
    SwapInterface,
    library.getSigner()
  );

  let tx = await SwapContract.nonceUsed(order.signerWallet, order.nonce);
  return tx;
};
