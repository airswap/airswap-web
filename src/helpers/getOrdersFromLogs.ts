import { Pool } from "@airswap/libraries";
import {
  getFullSwapERC20,
  OrderERC20,
  protocolFeeReceiverAddresses,
} from "@airswap/utils";

import { BigNumber, Event } from "ethers";

import { transformFullSwapERC20ToOrderERC20 } from "../entities/OrderERC20/OrderERC20Transformers";

interface OrderErc20WithTimestamp {
  hash: string;
  params: OrderERC20;
  senderWallet: string;
  timestamp: number;
}

export const getOrdersFromLogs = async (
  chainId: number,
  logs: Event[]
): Promise<OrderErc20WithTimestamp[]> => {
  const feeReceiver =
    protocolFeeReceiverAddresses[chainId] || Pool.getAddress(chainId);

  if (!feeReceiver) {
    console.error(
      `[getOrdersFromLogs]: No fee receiver found for chain ${chainId}`
    );

    return [];
  }

  const [receipts, blocks] = await Promise.all([
    Promise.all(logs.map((log) => log.getTransactionReceipt())),
    Promise.all(logs.map((log) => log.getBlock())),
  ]);

  const responses: (OrderErc20WithTimestamp | undefined)[] = await Promise.all(
    logs.map(async (swapLog, index) => {
      const args = swapLog.args || [];
      const nonce = args[0] as BigNumber | undefined;
      const signerAddress = args[1] as string | undefined;

      if (!signerAddress || !nonce) return;

      const receipt = receipts[index];

      const swap = await getFullSwapERC20(
        swapLog.transactionHash,
        signerAddress,
        feeReceiver,
        receipt.logs
      );

      const order = transformFullSwapERC20ToOrderERC20(swap, nonce.toString());

      return {
        hash: swapLog.transactionHash,
        params: order,
        senderWallet: swap.senderWallet,
        timestamp: blocks[index].timestamp * 1000,
      };
    })
  );

  return responses.filter((order) => !!order) as OrderErc20WithTimestamp[];
};
