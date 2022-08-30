import { FullOrder } from "@airswap/typescript";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { ErrorType } from "../../constants/errors";

export interface MakeOtcState {
  lastUserOrder?: FullOrder;
  status: "idle" | "signing" | "taking" | "failed" | "reset";
  userOrders: FullOrder[];
  takeOrder?: FullOrder;
  errors: ErrorType[];
}

const initialState: MakeOtcState = {
  status: "idle",
  userOrders: [],
  errors: [],
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
    setTakeOrder: (state, action: PayloadAction<FullOrder>): MakeOtcState => {
      return {
        ...state,
        takeOrder: action.payload,
      };
    },
    setErrors: (state, action: PayloadAction<ErrorType[]>): MakeOtcState => {
      return {
        ...state,
        errors: action.payload,
      };
    },
    reset: (state): MakeOtcState => {
      return initialState;
    },
  },
});

export const {
  setStatus,
  setUserOrder,
  clearLastUserOrder,
  setTakeOrder,
  setErrors,
  reset,
} = makeOtcSlice.actions;

export const selectMakeOtcReducer = (state: RootState) => state.otc;

export default makeOtcSlice.reducer;
