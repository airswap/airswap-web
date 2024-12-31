import { FullOrderERC20 } from "@airswap/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { AppError } from "../../errors/appError";

export interface TakeOtcState {
  activeOrder?: FullOrderERC20;
  status: "idle" | "invalid" | "open" | "taken" | "signing" | "failed";
  errors: AppError[];
}

const initialState: TakeOtcState = {
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

export const { setActiveOrder, setStatus, setErrors, reset } =
  takeOtcSlice.actions;

export const selectTakeOtcReducer = (state: RootState) => state.takeOtc;

export const selectTakeOtcErrors = (state: RootState) => state.takeOtc.errors;

export const selectTakeOtcStatus = (state: RootState) => state.takeOtc.status;

export default takeOtcSlice.reducer;
