import { useEffect, useState } from "react";

import { useAppSelector } from "../../../app/hooks";
import { TransactionEvent } from "../../../types/transactionTypes";
import useLatestApproveFromEvents from "./useLatestApproveFromEvents";
import useLatestCancelFromEvents from "./useLatestCancelFromEvents";
import useLatestDelegatedSwapFromEvents from "./useLatestDelegateSwapFromEvents";
import useLatestDepositOrWithdrawFromEvents from "./useLatestDepositOrWithdrawFromEvents";
import useLatestSetRuleFromEvents from "./useLatestSetRuleFromEvents";
import useLatestSwapErc20FromEvents from "./useLatestSwapErc20FromEvents";
import useLatestSwapFromEvents from "./useLatestSwapFromEvents";
import useLatestUnsetRuleFromEvents from "./useLatestUnsetRuleFromEvents";

const useLatestTransactionEvent = () => {
  const { account, chainId } = useAppSelector((state) => state.web3);

  const latestSwapEvent = useLatestSwapFromEvents(chainId, account);
  const latestSwapErc20Event = useLatestSwapErc20FromEvents(chainId, account);
  const latestApproveEvent = useLatestApproveFromEvents(chainId, account);
  const latestDepositOrWithdrawEvent = useLatestDepositOrWithdrawFromEvents(
    chainId,
    account
  );
  const latestCancelEvent = useLatestCancelFromEvents(chainId, account);
  const latestSetRuleEvent = useLatestSetRuleFromEvents(chainId, account);
  const latestUnsetRuleEvent = useLatestUnsetRuleFromEvents(chainId, account);
  const latestDelegateSwapEvent = useLatestDelegatedSwapFromEvents(
    chainId,
    account
  );

  const [latestEvent, setLatestEvent] = useState<TransactionEvent>();

  useEffect(() => {
    if (latestSwapEvent) {
      setLatestEvent(latestSwapEvent);
    }
  }, [latestSwapEvent]);

  useEffect(() => {
    if (latestSwapErc20Event) {
      setLatestEvent(latestSwapErc20Event);
    }
  }, [latestSwapErc20Event]);

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

  useEffect(() => {
    if (latestSetRuleEvent) {
      setLatestEvent(latestSetRuleEvent);
    }
  }, [latestSetRuleEvent]);

  useEffect(() => {
    if (latestUnsetRuleEvent) {
      setLatestEvent(latestUnsetRuleEvent);
    }
  }, [latestUnsetRuleEvent]);

  useEffect(() => {
    if (latestDelegateSwapEvent) {
      setLatestEvent(latestDelegateSwapEvent);
    }
  }, [latestDelegateSwapEvent]);

  return latestEvent;
};

export default useLatestTransactionEvent;
