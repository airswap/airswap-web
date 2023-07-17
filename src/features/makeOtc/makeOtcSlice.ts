import { FullOrderERC20 } from "@airswap/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { AppError } from "../../errors/appError";

export interface MakeOtcState {
  lastUserOrder?: FullOrderERC20;
  status: "idle" | "signing" | "failed" | "reset";
  error?: AppError;
}

const initialState: MakeOtcState = {
  status: "idle",
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
    setUserOrder: (
      state,
      action: PayloadAction<FullOrderERC20>
    ): MakeOtcState => {
      return {
        ...state,
        lastUserOrder: action.payload,
      };
    },
    clearLastUserOrder: (state): MakeOtcState => {
      return {
        ...state,
        lastUserOrder: undefined,
      };
    },
    setError: (
      state,
      action: PayloadAction<AppError | undefined>
    ): MakeOtcState => {
      return {
        ...state,
        error: action.payload,
      };
    },
    reset: (): MakeOtcState => {
      return initialState;
    },
  },
});

export const { setStatus, setUserOrder, clearLastUserOrder, setError, reset } =
  makeOtcSlice.actions;

export const selectMakeOtcReducer = (state: RootState) => state.makeOtc;

export default makeOtcSlice.reducer;
