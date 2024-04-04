import { useEffect, useState } from "react";

import { WETH } from "@airswap/libraries";
import { useWeb3React } from "@web3-react/core";

import { BigNumber, providers, Event } from "ethers";

import { WETHEvent } from "../../../entities/WETHEvent/WETHEvent";
import { transformToDepositOrWithdrawEvent } from "../../../entities/WETHEvent/WETHEventTransformers";
import { compareAddresses } from "../../../helpers/string";
import useDebounce from "../../../hooks/useDebounce";
import { WethEventType } from "../../../types/wethEventType";

const useLatestDepositOrWithdrawFromEvents = (
  chainId?: number,
  account?: string | null
): WETHEvent | undefined => {
  const { library: provider } = useWeb3React<providers.Provider>();

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();
  const [latestDepositOrWithdraw, setLatestDepositOrWithdraw] =
    useState<WETHEvent>();
  const [
    debouncedLatestDepositOrWithdraw,
    setDebouncedLatestDepositOrWithdraw,
  ] = useState<WETHEvent>();

  useDebounce(
    () => {
      setDebouncedLatestDepositOrWithdraw(latestDepositOrWithdraw);
    },
    1000,
    [latestDepositOrWithdraw]
  );

  useEffect(() => {
    if (!chainId || !account || !provider) return;

    if (account === accountState && chainId === chainIdState) return;

    const wethContract = WETH.getContract(provider, chainId);
    const depositEvent = "Deposit";
    const withdrawEvent = "Withdrawal";

    const handleEvent = async (
      type: WethEventType,
      from: string,
      value: BigNumber,
      depositEvent: Event
    ) => {
      if (!compareAddresses(from, account)) {
        return;
      }

      const receipt = await depositEvent.getTransactionReceipt();
      setLatestDepositOrWithdraw(
        transformToDepositOrWithdrawEvent(
          type,
          value.toString(),
          depositEvent.transactionHash,
          receipt.status
        )
      );
    };

    const handleDepositEvent = async (
      from: string,
      value: BigNumber,
      depositEvent: Event
    ) => {
      handleEvent(WethEventType.deposit, from, value, depositEvent);
    };

    const handleWithdrawEvent = async (
      from: string,
      value: BigNumber,
      depositEvent: Event
    ) => {
      handleEvent(WethEventType.withdrawal, from, value, depositEvent);
    };

    wethContract.off(depositEvent, handleDepositEvent);
    wethContract.off(withdrawEvent, handleWithdrawEvent);
    wethContract.on(depositEvent, handleDepositEvent);
    wethContract.on(withdrawEvent, handleWithdrawEvent);

    setAccountState(account);
    setChainIdState(chainId);

    return () => {
      wethContract.off(depositEvent, handleDepositEvent);
      wethContract.off(withdrawEvent, handleWithdrawEvent);
    };
  }, [chainId, account, provider]);

  return debouncedLatestDepositOrWithdraw;
};

export default useLatestDepositOrWithdrawFromEvents;
