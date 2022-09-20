import { Swap } from "@airswap/libraries";
// @ts-ignore
import * as swapDeploys from "@airswap/swap/deploys";
import { FullOrder } from "@airswap/typescript";
import {
  decompressFullOrder,
  getSignerFromSwapSignature,
  isValidFullOrder,
} from "@airswap/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { ethers } from "ethers";

import { reset, setActiveOrder, setStatus } from "./takeOtcSlice";

export const decompressAndSetActiveOrder = createAsyncThunk(
  "take-otc/decompressAndSetActiveOrder",
  async (compressedOrder: string, { dispatch }) => {
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
  }
);

export const takeOtcOrder = createAsyncThunk(
  "take-otc/takeOtcOrder",
  async (
    params: {
      chainId: number;
      order: FullOrder;
      library: ethers.providers.Web3Provider;
    },
    { dispatch }
  ) => {
    console.log(params);

    const errors = await new Swap(params.chainId).check(
      params.order,
      params.order.senderWallet,
      params.library.getSigner()
    );

    console.log(errors);

    const signerWallet = getSignerFromSwapSignature(
      params.order,
      swapDeploys[params.chainId],
      params.chainId,
      params.order.v,
      params.order.r,
      params.order.s
    );

    console.log(signerWallet);

    // @ts-ignore
    const swap = await new Swap(params.chainId, params.library).swap(
      params.order,
      params.library.getSigner()
    );

    console.log(swap);
  }
);
