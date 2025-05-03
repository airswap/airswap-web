import { Delegate } from "@airswap/libraries";
import { FullSwapERC20 } from "@airswap/utils";

import { BigNumber } from "bignumber.js";
import { Event } from "ethers";

import { DelegatedSwapEvent } from "../../../entities/DelegateRule/DelegateRule";
import { transformToDelegatedSwapEvent } from "../../../entities/DelegateRule/DelegateRuleTransformers";
import { compareAddresses } from "../../../helpers/string";
import { FullSwapErc20Log } from "./getOrdersFromSwapErc20Logs";

/**
 * Gets orders where the delegate contract is the sender wallet and transforms them
 * to show the user's wallet as the sender when nonces match
 */

export const getOrdersFromDelegatedSwapLogs = (
  account: string,
  chainId: number,
  orderLogs: FullSwapErc20Log[],
  events: Event[]
): FullSwapErc20Log[] => {
  const delegateAddress = Delegate.getAddress(chainId);

  if (!delegateAddress) return [];

  const delegatedSwapsEvents = events
    .filter((event) => compareAddresses(event.args?.[0] as string, account))
    .map((event) => {
      const args = event.args || [];

      const senderWallet = args[0] as string;
      const signerWallet = args[1] as string;
      const nonce = args[2] as BigNumber;

      return transformToDelegatedSwapEvent(
        senderWallet,
        signerWallet,
        nonce.toString(),
        chainId,
        event.transactionHash
      );
    });

  const delegatedOrderLogs = orderLogs
    .filter((log) => compareAddresses(log.swap.senderWallet, delegateAddress))
    .filter((log) =>
      delegatedSwapsEvents.some((event) => event.nonce === log.order.nonce)
    )
    .map((log) => {
      const matchingEvent = delegatedSwapsEvents.find(
        (event) => event.nonce === log.order.nonce
      );

      if (!matchingEvent) return;

      return getModifiedOrderLog(log, matchingEvent);
    })
    .filter(Boolean);

  return delegatedOrderLogs as FullSwapErc20Log[];
};

const getModifiedOrderLog = (
  log: FullSwapErc20Log,
  event: DelegatedSwapEvent
) => {
  const modifiedSwap: FullSwapERC20 = {
    ...log.swap,
    senderWallet: event.senderWallet,
  };

  return {
    ...log,
    swap: modifiedSwap,
  } as FullSwapErc20Log;
};
