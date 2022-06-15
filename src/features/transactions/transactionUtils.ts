import * as SwapContract from "@airswap/swap/build/contracts/Swap.sol/Swap.json";
import * as WrapperContract from "@airswap/wrapper/build/contracts/Wrapper.sol/Wrapper.json";
import { Interface } from "@ethersproject/abi";

import { Event as EthersEvent, BigNumber as EthersBigNumber } from "ethers";

const wrapperInterface = new Interface(WrapperContract.abi);
const swapInterface = new Interface(SwapContract.abi);

// Event from interface for reference.
// event Swap(
//   uint256 indexed nonce,
//   uint256 timestamp,
//   address indexed signerWallet,
//   address signerToken,
//   uint256 signerAmount,
//   uint256 protocolFee,
//   address indexed senderWallet,
//   address senderToken,
//   uint256 senderAmount
// );

export type SwapEventArgs = {
  nonce: EthersBigNumber;
  timestamp: EthersBigNumber;
  signerWallet: string;
  signerToken: string;
  signerAmount: EthersBigNumber;
  protocolFee: EthersBigNumber;
  senderWallet: string;
  senderToken: string;
  senderAmount: EthersBigNumber;
};

/**
 * When swapping using the wrapper (i.e. when making a swap to/from ETH and not
 * WETH), the `senderWallet` will be the address of the wrapper contract. This
 * function finds the `WrappedSwapFor` log which is also emitted and contains
 * the 'true' sender.
 * @param log The `Swap` log with wrapper as senderWallet
 * @returns Promise<String> The original senderWallet
 */
const getSenderWalletForWrapperSwapLog: (
  log: EthersEvent
) => Promise<string> = async (log) => {
  const receipt = await log.getTransactionReceipt();
  // Find the `WrappedSwapFor` log that must have been emitted too.
  for (let i = 0; i < receipt.logs.length; i++) {
    try {
      const parsedLog = wrapperInterface.parseLog(receipt.logs[i]);
      if (parsedLog.name === "WrappedSwapFor") {
        console.log(parsedLog.args.senderWallet);
        return parsedLog.args.senderWallet.toLowerCase();
      }
    } catch (e) {
      // Most likely trying to decode logs from other contract, e.g. ERC20
      // We can ignore the error and check the next log.
      continue;
    }
  }
  throw new Error(
    `Could not find WrappedSwapFor event in tx with hash: ${log.transactionHash}`
  );
};

const getSwapArgsFromWrappedSwapForLog: (
  log: EthersEvent
) => Promise<SwapEventArgs> = async (log: EthersEvent) => {
  const receipt = await log.getTransactionReceipt();
  // Find the `Swap` log that must have been emitted too.
  for (let i = 0; i < receipt.logs.length; i++) {
    try {
      const parsedLog = swapInterface.parseLog(receipt.logs[i]);
      if (parsedLog.name === "Swap") {
        return parsedLog.args as unknown as SwapEventArgs;
      }
    } catch (e) {
      // Most likely trying to decode logs from other contract, e.g. ERC20
      // We can ignore the error and check the next log.
      continue;
    }
  }
  throw new Error(
    `Could not find Swap event in tx with hash: ${log.transactionHash}`
  );
};

export { getSenderWalletForWrapperSwapLog, getSwapArgsFromWrappedSwapForLog };
