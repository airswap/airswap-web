import { FullOrderERC20 } from "@airswap/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { AppError } from "../../errors/appError";

export interface TakeOtcState {
  isCancelSuccessFull: boolean;
  activeOrder?: FullOrderERC20;
  status: "idle" | "not-found" | "open" | "taken" | "signing" | "failed";
  errors: AppError[];
}

const initialState: TakeOtcState = {
  isCancelSuccessFull: false,
  status: "idle",
  errors: [],
};

export const takeOtcSlice = createSlice({
  name: "take-otc",
  initialState,
  reducers: {
    setActiveOrder: (
      state,
      action: PayloadAction<FullOrderERC20>
    ): TakeOtcState => {
      return {
        ...state,
        activeOrder: action.payload,
      };
    },
    setIsCancelSuccessFull: (
      state,
      action: PayloadAction<boolean>
    ): TakeOtcState => {
      return {
        ...state,
        isCancelSuccessFull: action.payload,
      };
    },
    setStatus: (
      state,
      action: PayloadAction<TakeOtcState["status"]>
    ): TakeOtcState => {
      return {
        ...state,
        status: action.payload,
      };
    },
    setErrors: (state, action: PayloadAction<AppError[]>): TakeOtcState => {
      return {
        ...state,
        errors: action.payload,
      };
    },
    reset: (state): TakeOtcState => {
      return initialState;
    },
  },
});

export const {
  setActiveOrder,
  setStatus,
  setErrors,
  setIsCancelSuccessFull,
  reset,
} = takeOtcSlice.actions;

export const selectTakeOtcReducer = (state: RootState) => state.takeOtc;

export const selectTakeOtcErrors = (state: RootState) => state.takeOtc.errors;

export const selectTakeOtcStatus = (state: RootState) => state.takeOtc.status;

export default takeOtcSlice.reducer;
