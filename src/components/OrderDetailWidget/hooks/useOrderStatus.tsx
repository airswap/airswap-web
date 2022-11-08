import { useCallback, useEffect, useMemo, useState } from "react";

import { FullOrder } from "@airswap/typescript";
import { useWeb3React } from "@web3-react/core";

import { getNonceUsed } from "../../../features/orders/orderApi";
import useCancellationSuccess from "../../../hooks/useCancellationSuccess";
import { OrderStatus } from "../../../types/orderStatus";

export const useOrderStatus = (order: FullOrder): OrderStatus => {
  const { library } = useWeb3React();

  const [isTaken, setIsTaken] = useState(false);
  const expiry = useMemo(() => parseInt(order.expiry) * 1000, [order]);
  const isCanceled = useCancellationSuccess(order.nonce);
  const isExpired = new Date().getTime() > expiry;

  const asyncGetTakenState = useCallback(
    async (order: FullOrder) => {
      if (library) {
        const response = await getNonceUsed(order, library);

        setIsTaken(response);
      }
    },
    [library]
  );

  useEffect(() => {
    if (library) {
      asyncGetTakenState(order).catch(console.error);
    }
  }, [order, library, asyncGetTakenState]);

  if (isCanceled) {
    return OrderStatus.canceled;
  }

  if (isTaken) {
    return OrderStatus.taken;
  }

  return isExpired ? OrderStatus.expired : OrderStatus.open;
};
