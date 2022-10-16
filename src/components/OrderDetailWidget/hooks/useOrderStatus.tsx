import { useState, useEffect, useCallback } from "react";

import { FullOrder } from "@airswap/typescript";
import { useWeb3React } from "@web3-react/core";

import { getTakenState } from "../../../features/takeOtc/takeOtcHelpers";
import { OrderStatus } from "../../../types/orderStatus";

export const useOrderStatus = (order: FullOrder): OrderStatus => {
  const { library } = useWeb3React();
  const [isTaken, setIsTaken] = useState(false);

  const asyncGetTakenState = useCallback(async () => {
    if (order && library) {
      const response = await getTakenState(order, library);

      setIsTaken(response);
    }
  }, [order, library]);

  useEffect(() => {
    if (order && library) {
      asyncGetTakenState().catch(console.error);
    }
  }, [order, library, asyncGetTakenState]);

  return isTaken ? OrderStatus.taken : OrderStatus.open;
};
