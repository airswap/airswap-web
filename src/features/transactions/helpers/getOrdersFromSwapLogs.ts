import { Pool } from "@airswap/libraries";
import {
  ADDRESS_ZERO,
  FullOrder,
  protocolFeeReceiverAddresses,
  TokenKinds,
} from "@airswap/utils";

import { BigNumber, Event } from "ethers";

export interface FullSwapLog {
  hash: string;
  order: FullOrder;
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
      const nonce = args[0] as BigNumber | undefined;
      const signerWallet = args[1] as string | undefined;
      const signerAmount = args[2] as BigNumber | undefined;
      const signerId = args[3] as BigNumber | undefined;
      const signerToken = args[4] as string | undefined;
      const senderWallet = args[5] as string | undefined;
      const senderAmount = args[6] as BigNumber | undefined;
      const senderId = args[7] as BigNumber | undefined;
      const senderToken = args[8] as string | undefined;
      const affiliateWallet = args[9] as string | undefined;
      const affiliateAmount = args[10] as BigNumber | undefined;

      if (
        !signerWallet ||
        !nonce ||
        !signerAmount ||
        !signerId ||
        !signerToken ||
        !senderWallet ||
        !senderAmount ||
        !senderId ||
        !senderToken ||
        !affiliateAmount ||
        !affiliateWallet
      )
        return;

      const order: FullOrder = {
        signer: {
          wallet: signerWallet,
          token: signerToken,
          amount: signerAmount.toString(),
          kind: TokenKinds.ERC721,
          id: signerId.toString(),
        },
        sender: {
          wallet: senderWallet,
          token: senderToken,
          amount: senderAmount.toString(),
          kind: TokenKinds.ERC20,
          id: senderId.toString(),
        },
        affiliateWallet,
        affiliateAmount: affiliateAmount.toString(),
        nonce: nonce.toString(),
        expiry: "0",
        protocolFee: "0",
        v: "0",
        r: "0",
        s: "0",
        chainId,
        swapContract: ADDRESS_ZERO,
      };

      return {
        hash: swapLog.transactionHash,
        order,
        timestamp: blocks[index]?.timestamp
          ? blocks[index].timestamp * 1000
          : 0,
      };
    })
  );

  return responses.filter((order) => !!order) as FullSwapLog[];
};
