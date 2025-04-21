import { useEffect, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { TransactionTypes } from "../../types/transactionTypes";
import { selectActiveTokens } from "../metadata/metadataSlice";
import useLatestSucceededTransaction from "../transactions/hooks/useLatestSucceededTransaction";
import {
  requestActiveTokenAllowancesDelegate,
  requestActiveTokenAllowancesSwap,
  requestActiveTokenAllowancesSwapERC20,
  requestActiveTokenAllowancesWrapper,
  requestActiveTokenBalances,
} from "./balancesSlice";

export const useBalances = () => {
  const { provider: library } = useWeb3React<Web3Provider>();
  const { isActive, account, chainId } = useAppSelector((state) => state.web3);
  const dispatch = useAppDispatch();

  const activeTokens = useAppSelector(selectActiveTokens);
  const latestSuccessfulTransaction = useLatestSucceededTransaction();

  const [activeAccount, setActiveAccount] = useState<string>();
  const [activeChainId, setActiveChainId] = useState<number>();
  const [activeTokensLength, setActiveTokensLength] = useState<number>(0);

  useEffect(() => {
    if (!library || !activeTokens.length || !account) {
      return;
    }

    if (
      activeAccount === account &&
      activeChainId === chainId &&
      activeTokens.length <= activeTokensLength
    ) {
      setActiveTokensLength(activeTokens.length);

      return;
    }

    setActiveAccount(account);
    setActiveChainId(chainId);
    setActiveTokensLength(activeTokens.length);

    dispatch(requestActiveTokenBalances({ provider: library }));
    dispatch(requestActiveTokenAllowancesSwap({ provider: library }));
    dispatch(requestActiveTokenAllowancesSwapERC20({ provider: library }));
    dispatch(requestActiveTokenAllowancesWrapper({ provider: library }));
    dispatch(requestActiveTokenAllowancesDelegate({ provider: library }));
  }, [account, chainId, library, activeTokens]);

  useEffect(() => {
    setActiveTokensLength(activeTokens.length);
  }, [account, chainId]);

  useEffect(() => {
    if (!isActive) {
      setActiveAccount(undefined);
      setActiveChainId(undefined);
      setActiveTokensLength(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (!latestSuccessfulTransaction || !library) {
      return;
    }

    const { type } = latestSuccessfulTransaction;

    if (
      type === TransactionTypes.order ||
      type === TransactionTypes.delegatedSwap
    ) {
      dispatch(requestActiveTokenBalances({ provider: library }));
      dispatch(requestActiveTokenAllowancesSwap({ provider: library }));
      dispatch(requestActiveTokenAllowancesSwapERC20({ provider: library }));
      dispatch(requestActiveTokenAllowancesWrapper({ provider: library }));
      dispatch(requestActiveTokenAllowancesDelegate({ provider: library }));
    }

    if (
      type === TransactionTypes.withdraw ||
      type === TransactionTypes.deposit
    ) {
      dispatch(requestActiveTokenBalances({ provider: library }));
    }

    if (type === TransactionTypes.approval) {
      dispatch(requestActiveTokenAllowancesSwap({ provider: library }));
      dispatch(requestActiveTokenAllowancesSwapERC20({ provider: library }));
      dispatch(requestActiveTokenAllowancesWrapper({ provider: library }));
      dispatch(requestActiveTokenAllowancesDelegate({ provider: library }));
    }
  }, [latestSuccessfulTransaction]);
};

export default useBalances;
