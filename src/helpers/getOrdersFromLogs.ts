import { Pool } from "@airswap/libraries";
import {
  ADDRESS_ZERO,
  FullSwapERC20,
  getFullSwapERC20,
  OrderERC20,
  protocolFeeReceiverAddresses,
} from "@airswap/utils";

import { BigNumber, Event } from "ethers";

import { transformFullSwapERC20ToOrderERC20 } from "../entities/OrderERC20/OrderERC20Transformers";

interface FullSwapErc20Log {
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

      const order = transformFullSwapERC20ToOrderERC20(swap, nonce.toString());

      return {
        hash: swapLog.transactionHash,
        order,
        swap,
        timestamp: blocks[index].timestamp * 1000,
      };
    })
  );

  return responses.filter((order) => !!order) as FullSwapErc20Log[];
};

export const getOrdersFromWrappedEventLogs = (
  logs: FullSwapErc20Log[],
  wrappedEvents: Event[]
): FullSwapErc20Log[] => {
  const filteredLogs = logs.map((log) => {
    const wrappedEvent = wrappedEvents.find(
      (event) => event.transactionHash === log.hash
    );

    if (!wrappedEvent) return;

    const args = wrappedEvent.args || [];
    const senderWallet = args[0] as string | undefined;

    if (!senderWallet) return;

    const order: OrderERC20 = {
      ...log.order,
      senderToken: ADDRESS_ZERO,
    };

    const swap: FullSwapERC20 = {
      ...log.swap,
      senderToken: ADDRESS_ZERO,
      senderWallet,
    };

    return {
      ...log,
      order,
      swap,
    };
  });

  return filteredLogs.filter(Boolean) as FullSwapErc20Log[];
};
