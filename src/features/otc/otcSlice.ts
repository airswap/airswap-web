import { FullOrder } from "@airswap/typescript";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { ErrorType } from "../../constants/errors";

export interface OtcState {
  lastUserOrder?: FullOrder;
  status: "idle" | "signing" | "taking" | "failed" | "reset";
  userOrders: FullOrder[];
  errors: ErrorType[];
}

const initialState: OtcState = {
  status: "idle",
  userOrders: [],
  errors: [],
};

export const otcSlice = createSlice({
  name: "otc",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<OtcState["status"]>): OtcState => {
      return {
        ...state,
        status: action.payload,
      };
    },
    setUserOrder: (state, action: PayloadAction<FullOrder>): OtcState => {
      return {
        ...state,
        lastUserOrder: action.payload,
        userOrders: [...state.userOrders, action.payload],
      };
    },
    setErrors: (state, action: PayloadAction<ErrorType[]>): OtcState => {
      return {
        ...state,
        errors: action.payload,
      };
    },
    reset: (state): OtcState => {
      return initialState;
    },
  },
});

export const { setStatus, setUserOrder, setErrors, reset } = otcSlice.actions;

export const selectOtcReducer = (state: RootState) => state.otc;

export default otcSlice.reducer;
