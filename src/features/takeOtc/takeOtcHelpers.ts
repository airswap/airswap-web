import * as SwapContract from "@airswap/swap/build/contracts/Swap.sol/Swap.json";
// @ts-ignore
import * as swapDeploys from "@airswap/swap/deploys";
import { FullOrder } from "@airswap/typescript";

import { utils, Contract, providers } from "ethers";

const SwapInterface = new utils.Interface(JSON.stringify(SwapContract.abi));

export const getTakenState = async (
  order: FullOrder,
  library: providers.Web3Provider
) => {
  const SwapContract = new Contract(
    swapDeploys[order.chainId],
    SwapInterface,
    //@ts-ignore
    library.getSigner()
  );

  let tx = await SwapContract.nonceUsed(order.signerWallet, order.nonce);
  return tx;
};
