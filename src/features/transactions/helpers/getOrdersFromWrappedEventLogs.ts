import { ADDRESS_ZERO, FullSwapERC20, OrderERC20 } from "@airswap/utils";

import { Event } from "ethers";

import { FullSwapErc20Log } from "./getOrdersFromLogs";

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
