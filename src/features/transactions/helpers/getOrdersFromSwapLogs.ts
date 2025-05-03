import { Pool } from "@airswap/libraries";
import {
  FullSwapERC20,
  OrderERC20,
  protocolFeeReceiverAddresses,
} from "@airswap/utils";

import { BigNumber, Event } from "ethers";

import { transformFullSwapERC20ToOrderERC20 } from "../../../entities/OrderERC20/OrderERC20Transformers";
import { getFullSwapERC20 } from "../../../helpers/getFullSwapERC20";

export interface FullSwapLog {
  hash: string;
  order: OrderERC20;
  swap: FullSwapERC20;
  timestamp: number;
}

export const getOrdersFromSwapLogs = async (
  chainId: number,
  logs: Event[]
): Promise<FullSwapLog[]> => {
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

  const responses: (FullSwapLog | undefined)[] = await Promise.all(
    logs.map(async (swapLog, index) => {
      const args = swapLog.args || [];
      // nonce: BigNumber, 0
      //   signerWallet: string, 1
      //   signerAmount: BigNumber, 2
      //   signerId: BigNumber, 3
      //   signerToken: string, 4
      //   senderWallet: string, 5
      //   senderAmount: BigNumber, 6
      //   senderId: BigNumber, 7
      //   senderToken: string, 8
      //   affiliateWallet: string, 9
      //   affiliateAmount: BigNumber, 10
      //   swapEvent: Event, 11
      const nonce = args[0] as BigNumber | undefined;
      const signerWallet = args[1] as string | undefined;
      const signerAmount = args[2] as BigNumber | undefined;
      const signerToken = args[4] as string | undefined;
      const senderWallet = args[5] as string | undefined;
      const senderAmount = args[6] as BigNumber | undefined;
      const senderToken = args[8] as string | undefined;
      const affiliateAmount = args[10] as BigNumber | undefined;

      console.log("signerWallet", signerWallet);
      console.log("nonce", nonce);
      console.log("signerAmount", signerAmount);
      console.log("signerToken", signerToken);
      console.log("senderWallet", senderWallet);
      console.log("senderAmount", senderAmount);
      console.log("senderToken", senderToken);

      if (
        !signerWallet ||
        !nonce ||
        !signerAmount ||
        !signerToken ||
        !senderWallet ||
        !senderAmount ||
        !senderToken ||
        !affiliateAmount
      )
        return;

      // TODO: This needs to be swapped to FullOrder, convert to ERC20 for now
      const swap: FullSwapERC20 = {
        signerToken: signerToken,
        signerAmount: signerAmount.toString(),
        senderWallet: senderWallet,
        senderToken: senderToken,
        senderAmount: senderAmount.toString(),
        feeAmount: affiliateAmount.toString(),
        nonce: nonce.toString(),
        signerWallet: signerWallet,
      };

      const order = transformFullSwapERC20ToOrderERC20(swap, nonce.toString());

      console.log("order", order);

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

  return responses.filter((order) => !!order) as FullSwapLog[];
};
