import { Swap } from "@airswap/libraries";
import { fetchTokens } from "@airswap/metadata";
import * as SwapContract from "@airswap/swap/build/contracts/Swap.sol/Swap.json";
// @ts-ignore
import * as swapDeploys from "@airswap/swap/deploys";
import { FullOrder } from "@airswap/typescript";
import {
  decompressFullOrder,
  getSignerFromSwapSignature,
  isValidFullOrder,
} from "@airswap/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { ethers, utils, Contract } from "ethers";

import { reset, setActiveOrder, setStatus } from "./takeOtcSlice";

const SwapInterface = new utils.Interface(JSON.stringify(SwapContract.abi));

export const decompressAndSetActiveOrder = createAsyncThunk(
  "take-otc/decompressAndSetActiveOrder",
  async (params: { compressedOrder: string }, { dispatch }) => {
    dispatch(reset());

    try {
      const order = decompressFullOrder(params.compressedOrder);

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

export const cancelOrder = async (
  order: FullOrder,
  chainId: number,
  library: ethers.providers.Web3Provider
) => {
  const SwapContract = new Contract(
    swapDeploys[chainId],
    SwapInterface,
    library.getSigner()
  );

  let tx = await SwapContract.cancel([order.nonce]);
  console.log(tx);

  // test code to confirm nonce has been used
  /* 
  let checktx = await SwapContract.nonceUsed(order.signerWallet, order.nonce);
  console.log(checktx);
  */
};
