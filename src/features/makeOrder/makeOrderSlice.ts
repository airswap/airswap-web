import { FullOrder, FullOrderERC20 } from "@airswap/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { DelegateRule } from "../../entities/DelegateRule/DelegateRule";
import { AppError } from "../../errors/appError";

export interface MakeOrderState {
  lastDelegateRule?: DelegateRule;
  lastOtcOrder?: FullOrder | FullOrderERC20;
  status: "idle" | "signing" | "failed" | "reset";
  error?: AppError;
}

const initialState: MakeOrderState = {
  status: "idle",
};

export const makeOrderSlice = createSlice({
  name: "make-order",
  initialState,
  reducers: {
    setStatus: (
      state,
      action: PayloadAction<MakeOrderState["status"]>
    ): MakeOrderState => {
      return {
        ...state,
        status: action.payload,
      };
    },
    setDelegateRule: (
      state,
      action: PayloadAction<DelegateRule>
    ): MakeOrderState => {
      return {
        ...state,
        lastDelegateRule: action.payload,
      };
    },
    setOtcOrder: (
      state,
      action: PayloadAction<FullOrder | FullOrderERC20>
    ): MakeOrderState => {
      return {
        ...state,
        lastOtcOrder: action.payload,
      };
    },
    clearLastUserOrder: (state): MakeOrderState => {
      return {
        ...state,
        lastOtcOrder: undefined,
        lastDelegateRule: undefined,
      };
    },
    setError: (
      state,
      action: PayloadAction<AppError | undefined>
    ): MakeOrderState => {
      return {
        ...state,
        error: action.payload,
      };
    },
    reset: (): MakeOrderState => {
      return initialState;
    },
  },
});

export const {
  setDelegateRule,
  setStatus,
  setOtcOrder,
  clearLastUserOrder,
  setError,
  reset,
} = makeOrderSlice.actions;

export const selectMakeOrderReducer = (state: RootState) => state.makeOrder;

export default makeOrderSlice.reducer;
