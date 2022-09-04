import { decompressFullOrder, isValidFullOrder } from "@airswap/utils";

import { AppDispatch } from "../../app/store";
import { reset, setActiveOrder, setStatus } from "./takeOtcSlice";

export const decompressAndSetActiveOrder =
  (compressedOrder: string) => async (dispatch: AppDispatch) => {
    dispatch(reset());

    try {
      const order = decompressFullOrder(compressedOrder);

      if (!isValidFullOrder(order)) {
        return dispatch(setStatus("not-found"));
      }

      dispatch(setActiveOrder(order));
      dispatch(setStatus("open"));
    } catch (e) {
      console.error(e);
      dispatch(setStatus("not-found"));
    }
  };
