import { FullOrder } from "@airswap/typescript";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { ErrorType } from "../../constants/errors";

export interface TakeOtcState {
  activeOrder?: FullOrder;
  status: "idle" | "not-found" | "open" | "taken" | "canceled";
  errors: ErrorType[];
}

const initialState: TakeOtcState = {
  status: "idle",
  errors: [],
};

export const takeOtcSlice = createSlice({
  name: "take-otc",
  initialState,
  reducers: {
    setActiveOrder: (state, action: PayloadAction<FullOrder>): TakeOtcState => {
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
    setErrors: (state, action: PayloadAction<ErrorType[]>): TakeOtcState => {
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

export default takeOtcSlice.reducer;
