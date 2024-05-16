import { useEffect, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { TransactionTypes } from "../../types/transactionTypes";
import { fetchUnkownTokens } from "../metadata/metadataActions";
import { selectActiveTokens } from "../metadata/metadataSlice";
import useLatestSucceededTransaction from "../transactions/hooks/useLatestSucceededTransaction";
import {
  requestActiveTokenAllowancesSwap,
  requestActiveTokenAllowancesWrapper,
  requestActiveTokenBalances,
} from "./balancesSlice";

export const useBalances = () => {
  const { provider: library } = useWeb3React<Web3Provider>();
  const { account, chainId } = useAppSelector((state) => state.web3);
  const dispatch = useAppDispatch();

  const activeTokens = useAppSelector(selectActiveTokens);
  const latestSuccessfulTransaction = useLatestSucceededTransaction();

  const [activeAccount, setActiveAccount] = useState<string>();
  const [activeChainId, setActiveChainId] = useState<number>();

  useEffect(() => {
    if (!library || !activeTokens.length || !account) {
      return;
    }

    if (activeAccount === account && activeChainId === chainId) {
      return;
    }

    setActiveAccount(account);
    setActiveChainId(chainId);

    dispatch(requestActiveTokenBalances({ provider: library }));
    dispatch(requestActiveTokenAllowancesSwap({ provider: library }));
    dispatch(requestActiveTokenAllowancesWrapper({ provider: library }));
    dispatch(fetchUnkownTokens({ provider: library }));
  }, [account, chainId, library, activeTokens]);

  useEffect(() => {
    if (!latestSuccessfulTransaction || !library) {
      return;
    }

    const { type } = latestSuccessfulTransaction;

    if (type === TransactionTypes.order) {
      dispatch(requestActiveTokenBalances({ provider: library }));
      dispatch(requestActiveTokenAllowancesSwap({ provider: library }));
      dispatch(requestActiveTokenAllowancesWrapper({ provider: library }));
    }

    if (
      type === TransactionTypes.withdraw ||
      type === TransactionTypes.deposit
    ) {
      dispatch(requestActiveTokenBalances({ provider: library }));
    }

    if (type === TransactionTypes.approval) {
      dispatch(requestActiveTokenAllowancesSwap({ provider: library }));
      dispatch(requestActiveTokenAllowancesWrapper({ provider: library }));
    }
  }, [latestSuccessfulTransaction]);
};

export default useBalances;
