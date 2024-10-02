import { Pool } from "@airswap/libraries";
import {
  FullSwapERC20,
  OrderERC20,
  protocolFeeReceiverAddresses,
} from "@airswap/utils";

import { BigNumber, Event } from "ethers";

import { transformFullSwapERC20ToOrderERC20 } from "../../../entities/OrderERC20/OrderERC20Transformers";
import { getFullSwapERC20 } from "../../../helpers/getFullSwapERC20";

export interface FullSwapErc20Log {
  hash: string;
  order: OrderERC20;
  swap: FullSwapERC20;
  timestamp: number;
}

export const getOrdersFromLogs = async (
  chainId: number,
  logs: Event[]
): Promise<FullSwapErc20Log[]> => {
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

  const responses: (FullSwapErc20Log | undefined)[] = await Promise.all(
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

      if (!swap) return;

      const order = transformFullSwapERC20ToOrderERC20(swap, nonce.toString());

      return {
        hash: swapLog.transactionHash,
        order,
        swap,
        timestamp: blocks[index]?.timestamp
          ? blocks[index].timestamp * 1000
          : 0,
      };
    })
  );

  return responses.filter((order) => !!order) as FullSwapErc20Log[];
};
