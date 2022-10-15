import { useState, useMemo } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../../../app/hooks";
import { getTakenState } from "../../../features/takeOtc/takeOtcHelpers";
import { selectTakeOtcReducer } from "../../../features/takeOtc/takeOtcSlice";
import { OrderStatus } from "../../../types/orderStatus";

export const useOrderStatus = () => {
  const { activeOrder } = useAppSelector(selectTakeOtcReducer);
  const { chainId, library } = useWeb3React();
  const [isTaken, setIsTaken] = useState(OrderStatus.open);

  useMemo(() => {
    if (library && chainId?.toString() === activeOrder!.chainId) {
      getTakenState(activeOrder!, library).then((r) =>
        setIsTaken(r ? OrderStatus.taken : OrderStatus.open)
      );
    }
  }, [activeOrder, chainId, library]);
  return isTaken;
};
