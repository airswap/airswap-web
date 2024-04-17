import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { TransactionEvent } from "../../../types/transactionTypes";
import useLatestApproveFromEvents from "./useLatestApproveFromEvents";
import useLatestCancelFromEvents from "./useLatestCancelFromEvents";
import useLatestDepositOrWithdrawFromEvents from "./useLatestDepositOrWithdrawFromEvents";
import useLatestSwapFromEvents from "./useLatestSwapFromEvents";

const useLatestTransactionEvent = () => {
  const { chainId, account, library } = useWeb3React();

  const latestSwapEvent = useLatestSwapFromEvents(chainId, account);
  const latestApproveEvent = useLatestApproveFromEvents(chainId, account);
  const latestDepositOrWithdrawEvent = useLatestDepositOrWithdrawFromEvents(
    chainId,
    account
  );
  const latestCancelEvent = useLatestCancelFromEvents(chainId, account);

  const [latestEvent, setLatestEvent] = useState<TransactionEvent>();

  useEffect(() => {
    if (latestSwapEvent) {
      setLatestEvent(latestSwapEvent);
    }
  }, [latestSwapEvent]);

  useEffect(() => {
    if (latestApproveEvent) {
      setLatestEvent(latestApproveEvent);
    }
  }, [latestApproveEvent]);

  useEffect(() => {
    if (latestDepositOrWithdrawEvent) {
      setLatestEvent(latestDepositOrWithdrawEvent);
    }
  }, [latestDepositOrWithdrawEvent]);

  useEffect(() => {
    if (latestCancelEvent) {
      setLatestEvent(latestCancelEvent);
    }
  }, [latestCancelEvent]);

  return latestEvent;
};

export default useLatestTransactionEvent;
