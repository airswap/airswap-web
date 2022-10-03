import { useState, useEffect, useMemo } from "react";

import { FullOrder } from "@airswap/typescript";

import { ethers } from "ethers";

import { getTakenState } from "../../../features/takeOtc/takeOtcActions";
import { OrderStatus } from "../../../types/orderStatus";

export const useOrderStatus = (
  order: FullOrder,
  chainId: number | undefined,
  library: ethers.providers.Web3Provider | undefined
) => {
  const [isTaken, setIsTaken] = useState(OrderStatus.open);

  useMemo(() => {
    if (library && chainId?.toString() === order.chainId) {
      try {
        getTakenState(order, library).then((r) =>
          setIsTaken(r ? OrderStatus.taken : OrderStatus.open)
        );
      } catch (e) {
        console.log(e);
      }
    }
  }, [order, chainId, library]);
  return isTaken;
};
