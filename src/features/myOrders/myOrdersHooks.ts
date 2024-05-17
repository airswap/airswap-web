import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUserOrdersFromLocalStorage } from "./myOrdersHelpers";
import { setUserOrders } from "./myOrdersSlice";

const useMyOrders = () => {
  const dispatch = useAppDispatch();

  const { account, chainId } = useAppSelector((state) => state.web3);

  const [activeAccount, setActiveAccount] = useState<string>();
  const [activeChainId, setActiveChainId] = useState<number>();

  useEffect(() => {
    if (!account || !chainId) {
      return;
    }

    if (account === activeAccount && chainId === activeChainId) {
      return;
    }

    setActiveAccount(account);
    setActiveChainId(chainId);

    const userOrders = getUserOrdersFromLocalStorage(account, chainId);

    dispatch(setUserOrders(userOrders));
  }, [account, chainId]);
};
