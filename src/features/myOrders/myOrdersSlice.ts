import { FullOrderERC20 } from "@airswap/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { setUserOrder } from "../makeOtc/makeOtcSlice";
import {
  setWalletConnected,
  setWalletDisconnected,
} from "../wallet/walletSlice";
import {
  getUserOrdersFromLocalStorage,
  writeUserOrdersToLocalStorage,
} from "./myOrdersHelpers";

export type OrdersSortType =
  | "active"
  | "senderToken"
  | "signerToken"
  | "expiry";

export interface MyOrdersState {
  userOrders: FullOrderERC20[];
  activeSortType: OrdersSortType;
  sortTypeDirection: Record<OrdersSortType, boolean>;
}

const initialState: MyOrdersState = {
  userOrders: [],
  activeSortType: "active",
  sortTypeDirection: {
    active: true,
    senderToken: true,
    signerToken: true,
    expiry: true,
  },
};

export const myOrdersSlice = createSlice({
  name: "make-otc",
  initialState,
  reducers: {
    removeUserOrder: (
      state,
      action: PayloadAction<FullOrderERC20>
    ): MyOrdersState => {
      const userOrders = [...state.userOrders].filter(
        (order) => order.nonce !== action.payload.nonce
      );
      writeUserOrdersToLocalStorage(
        userOrders,
        action.payload.signerWallet,
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
    ): MyOrdersState => {
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
    reset: (state): MyOrdersState => {
      return {
        ...initialState,
        userOrders: state.userOrders,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setWalletConnected, (state, action) => {
      const userOrders = getUserOrdersFromLocalStorage(
        action.payload.address,
        action.payload.chainId
      );

      return {
        ...state,
        userOrders,
      };
    });

    builder.addCase(setWalletDisconnected, (state, action) => {
      return initialState;
    });

    builder.addCase(setUserOrder, (state, action) => {
      const userOrders = [action.payload, ...state.userOrders];
      const { signerWallet, chainId } = action.payload;
      writeUserOrdersToLocalStorage(userOrders, signerWallet, chainId);

      return {
        ...state,
        userOrders,
      };
    });
  },
});

export const { removeUserOrder, reset, setActiveSortType } =
  myOrdersSlice.actions;

export const selectMyOrdersReducer = (state: RootState) => state.myOrders;

export default myOrdersSlice.reducer;
