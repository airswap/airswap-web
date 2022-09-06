import { FullOrder } from "@airswap/typescript";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { AppError } from "../../types/appError";

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
      return {
        ...state,
        lastUserOrder: action.payload,
        userOrders: [...state.userOrders, action.payload],
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
      return initialState;
    },
  },
});

export const { setStatus, setUserOrder, clearLastUserOrder, setError, reset } =
  makeOtcSlice.actions;

export const selectMakeOtcReducer = (state: RootState) => state.makeOtc;

export default makeOtcSlice.reducer;
