import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUserOrdersFromLocalStorage } from "./myOrdersHelpers";
import { setUserOrders } from "./myOrdersSlice";

const useMyOrders = () => {
  const dispatch = useAppDispatch();

  const { isActive, account, chainId } = useAppSelector((state) => state.web3);

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

  useEffect(() => {
    if (!isActive) {
      setActiveAccount(undefined);
      setActiveChainId(undefined);
    }
  }, [isActive]);
};

export default useMyOrders;
