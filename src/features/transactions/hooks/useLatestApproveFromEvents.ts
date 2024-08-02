import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import erc20Abi from "erc-20-abi";
import { BigNumber, Event, EventFilter, ethers } from "ethers";
import { hexZeroPad, id } from "ethers/lib/utils";

import { useAppSelector } from "../../../app/hooks";
import { ApproveEvent } from "../../../entities/ApproveEvent/ApproveEvent";
import { transformToApproveEvent } from "../../../entities/ApproveEvent/ApproveEventTransformers";
import { isApprovalTransaction } from "../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { getTransactionReceiptMined } from "../../../helpers/ethers";
import { compareAddresses } from "../../../helpers/string";
import { getSwapErc20Address } from "../../../helpers/swapErc20";
import { selectActiveTokens } from "../../metadata/metadataSlice";
import useLatestPendingTransaction from "./useLatestPendingTransaction";

const erc20Interface = new ethers.utils.Interface(erc20Abi);

const useLatestApproveFromEvents = (
  chainId?: number,
  account?: string | null
): ApproveEvent | undefined => {
  const { provider } = useWeb3React();
  const tokens = useAppSelector(selectActiveTokens);
  const latestPendingTransaction = useLatestPendingTransaction();

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();
  const [latestApprove, setLatestApprove] = useState<ApproveEvent>();

  useEffect(() => {
    let shouldCleanup = true;

    if (!chainId || !account || !provider || !tokens.length) {
      shouldCleanup = false;

      return;
    }

    if (account === accountState && chainId === chainIdState) {
      shouldCleanup = false;

      return;
    }

    const filter: EventFilter = {
      topics: [
        [id("Approval(address,address,uint256)")],
        hexZeroPad(account, 32),
      ],
    };

    const handleEvent = async (event: Event) => {
      const receipt = await provider.getTransactionReceipt(
        event.transactionHash
      );
      const tokenAddress = event.address;
      const parsedEvent = erc20Interface.parseLog(event);
      const spenderAddress = parsedEvent.args[1];
      const isApproval = parsedEvent.name === "Approval";
      const amount: BigNumber = parsedEvent.args[2];

      if (!isApproval) return;

      if (
        tokens.every((token) => !compareAddresses(token.address, tokenAddress))
      )
        return;

      if (!compareAddresses(spenderAddress, getSwapErc20Address(chainId) || ""))
        return;

      setLatestApprove(
        transformToApproveEvent(
          amount.toString(),
          receipt.transactionHash,
          spenderAddress,
          tokenAddress,
          receipt.status
        )
      );
    };

    setAccountState(account);
    setChainIdState(chainId);

    provider.on(filter, handleEvent);

    return () => {
      if (!shouldCleanup) return;

      provider.off(filter, handleEvent);
    };
  }, [chainId, account, provider, tokens.length]);

  // Normally the useEffect above should suffice, but gnosis safe has a bug where the event is not triggered.
  // This may also happen for other providers I have not tested. So this "backup" useEffect is a solution for this issue.

  useEffect(() => {
    if (!latestPendingTransaction || !provider) return;

    if (!isApprovalTransaction(latestPendingTransaction)) return;

    const handleTransaction = async () => {
      const receipt = await getTransactionReceiptMined(
        latestPendingTransaction.hash,
        provider
      );

      if (!receipt) return;

      setLatestApprove(
        transformToApproveEvent(
          latestPendingTransaction.amount,
          receipt.transactionHash,
          receipt.contractAddress,
          latestPendingTransaction.tokenAddress,
          receipt.status
        )
      );
    };

    handleTransaction();
  }, [latestPendingTransaction]);

  return latestApprove;
};

export default useLatestApproveFromEvents;
