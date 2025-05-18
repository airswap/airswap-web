import { FullOrder, FullOrderERC20 } from "@airswap/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { isFullOrder } from "../../entities/FullOrder/FullOrderHelpers";
import { OrdersSortType } from "../../types/ordersSortType";
import { setOtcOrder } from "../makeOrder/makeOrderSlice";
import { walletChanged, walletDisconnected } from "../web3/web3Actions";
import { writeOtcUserOrdersToLocalStorage } from "./myOtcOrdersHelpers";

export interface MyOtcOrdersState {
  userOrders: (FullOrder | FullOrderERC20)[];
  activeSortType: OrdersSortType;
  sortTypeDirection: Record<OrdersSortType, boolean>;
}

const initialState: MyOtcOrdersState = {
  userOrders: [],
  activeSortType: "active",
  sortTypeDirection: {
    active: true,
    expiry: true,
    filled: true,
    for: true,
    senderToken: true,
    signerToken: true,
  },
};

export const myOtcOrdersSlice = createSlice({
  name: "my-otc-orders",
  initialState,
  reducers: {
    removeOtcUserOrder: (
      state,
      action: PayloadAction<FullOrder | FullOrderERC20>
    ): MyOtcOrdersState => {
      const userOrders = [...state.userOrders].filter(
        (order) => order.nonce !== action.payload.nonce
      );
      const signerWallet = isFullOrder(action.payload)
        ? action.payload.signer.wallet
        : action.payload.signerWallet;
      writeOtcUserOrdersToLocalStorage(
        userOrders,
        signerWallet,
        action.payload.chainId
      );

      return {
        ...state,
        userOrders,
      };
    },
    setActiveSortType: (
      state,
      action: PayloadAction<OrdersSortType>
    ): MyOtcOrdersState => {
      const sortTypeDirection = { ...state.sortTypeDirection };
      const currentSorting = sortTypeDirection[action.payload];
      sortTypeDirection[action.payload] =
        action.payload === state.activeSortType
          ? !currentSorting
          : currentSorting;

      return {
        ...state,
        activeSortType: action.payload,
        sortTypeDirection: sortTypeDirection,
      };
    },
    setOtcUserOrders: (
      state,
      action: PayloadAction<(FullOrder | FullOrderERC20)[]>
    ): MyOtcOrdersState => {
      return {
        ...state,
        userOrders: action.payload,
      };
    },
    reset: (state): MyOtcOrdersState => {
      return {
        ...initialState,
        userOrders: state.userOrders,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(walletDisconnected, (): MyOtcOrdersState => initialState);
    builder.addCase(walletChanged, (): MyOtcOrdersState => initialState);

    builder.addCase(setOtcOrder, (state, action) => {
      const userOrders = [action.payload, ...state.userOrders];
      const signer = isFullOrder(action.payload)
        ? action.payload.signer.wallet
        : action.payload.signerWallet;
      const chainId = action.payload.chainId;
      writeOtcUserOrdersToLocalStorage(userOrders, signer, chainId);

      return {
        ...state,
        userOrders,
      };
    });
  },
});

export const {
  removeOtcUserOrder,
  reset,
  setActiveSortType,
  setOtcUserOrders,
} = myOtcOrdersSlice.actions;

export const selectMyOtcOrdersReducer = (state: RootState) => state.myOtcOrders;

export default myOtcOrdersSlice.reducer;
