import { useCallback, useEffect, useMemo, useState } from "react";

import { FullOrderERC20 } from "@airswap/types";

import { useAppSelector } from "../../../app/hooks";
import { getNonceUsed } from "../../../features/orders/orderApi";
import { selectPendingTransactions } from "../../../features/transactions/transactionsSlice";
import useCancellationSuccess from "../../../hooks/useCancellationSuccess";
import useDefaultLibrary from "../../../hooks/useDefaultLibrary";
import { OrderStatus } from "../../../types/orderStatus";

export const useOrderStatus = (
  order: FullOrderERC20
): [OrderStatus, boolean] => {
  const library = useDefaultLibrary(order.chainId);
  const pendingTransactions = useAppSelector(selectPendingTransactions);

  const [isTaken, setIsTaken] = useState(false);
  const expiry = useMemo(() => parseInt(order.expiry) * 1000, [order]);
  const [isExpired, setIsExpired] = useState(new Date().getTime() > expiry);
  const [isLoading, setIsLoading] = useState(true);
  const isCanceled = useCancellationSuccess(order.nonce);

  const asyncGetTakenState = useCallback(
    async (order: FullOrderERC20) => {
      if (library) {
        const response = await getNonceUsed(order, library);

        setIsTaken(response);
        setIsLoading(false);
      }
    },
    [library]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIsExpired(new Date().getTime() > expiry);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiry]);

  useEffect(() => {
    if (library) {
      asyncGetTakenState(order).catch(console.error);
    }
  }, [order, library, asyncGetTakenState, pendingTransactions.length]);

  if (isCanceled) {
    return [OrderStatus.canceled, isLoading];
  }

  if (isTaken) {
    return [OrderStatus.taken, isLoading];
  }

  return [isExpired ? OrderStatus.expired : OrderStatus.open, isLoading];
};
