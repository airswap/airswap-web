import { decompressFullOrder } from "@airswap/utils";

import { AppDispatch } from "../../app/store";
import { reset, setActiveOrder, setStatus } from "./takeOtcSlice";

export const decompressAndSetActiveOrder =
  (compressedOrder: string) => async (dispatch: AppDispatch) => {
    dispatch(reset());

    try {
      const order = decompressFullOrder(compressedOrder);

      // isValidOrder is not properly working, so if expiry or chainId is not defined
      // then the order must be invalid.
      if (!order.expiry || !order.chainId) {
        return dispatch(setStatus("not-found"));
      }

      dispatch(setActiveOrder(order));
      dispatch(setStatus("open"));
    } catch (e) {
      console.error(e);
      dispatch(setStatus("not-found"));
    }
  };
