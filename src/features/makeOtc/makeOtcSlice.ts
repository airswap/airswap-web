import { FullOrder } from "@airswap/typescript";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { AppError } from "../../errors/appError";
import {
  getUserOrdersFromLocalStorage,
  writeUserOrdersToLocalStorage
} from "./makeOtcHelpers";
import {setWalletConnected, setWalletDisconnected} from "../wallet/walletSlice";

export interface MakeOtcState {
  lastUserOrder?: FullOrder;
  status: "idle" | "signing" | "taking" | "failed" | "reset";
  userOrders: FullOrder[];
  error?: AppError;
}

const initialState: MakeOtcState = {
  status: "idle",
  userOrders: [],
};

export const makeOtcSlice = createSlice({
  name: "make-otc",
  initialState,
  reducers: {
    setStatus: (
      state,
      action: PayloadAction<MakeOtcState["status"]>
    ): MakeOtcState => {
      return {
        ...state,
        status: action.payload,
      };
    },
    setUserOrder: (state, action: PayloadAction<FullOrder>): MakeOtcState => {
      const userOrders = [action.payload, ...state.userOrders];
      const { senderWallet, chainId } = action.payload;
      writeUserOrdersToLocalStorage(userOrders, senderWallet, chainId);

      return {
        ...state,
        lastUserOrder: action.payload,
        userOrders,
      };
    },
    clearLastUserOrder: (state): MakeOtcState => {
      return {
        ...state,
        lastUserOrder: undefined,
      };
    },
    setError: (state, action: PayloadAction<AppError>): MakeOtcState => {
      return {
        ...state,
        error: action.payload,
      };
    },
    reset: (state): MakeOtcState => {
      return {
        ...initialState,
        userOrders: state.userOrders,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setWalletConnected, (state, action) => {
      const userOrders = getUserOrdersFromLocalStorage(action.payload.address, action.payload.chainId);
      console.log(userOrders);

      return {
        ...state,
        userOrders,
      }
    });

    builder.addCase(setWalletDisconnected, (state, action) => {
      return initialState;
    });
  }
});

export const { setStatus, setUserOrder, clearLastUserOrder, setError, reset } =
  makeOtcSlice.actions;

export const selectMakeOtcReducer = (state: RootState) => state.makeOtc;

export default makeOtcSlice.reducer;
