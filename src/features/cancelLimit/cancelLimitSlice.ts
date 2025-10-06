import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { AppError } from "../../errors/appError";

export interface CancelLimitOrderState {
  status: "idle" | "signing" | "failed";
  error?: AppError;
}

const initialState: CancelLimitOrderState = {
  status: "idle",
  error: undefined,
};

export const cancelLimitSlice = createSlice({
  name: "cancel-limit",
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    setStatus: (
      state,
      action: PayloadAction<CancelLimitOrderState["status"]>
    ) => {
      return {
        ...state,
        status: action.payload,
      };
    },
  },
});

export const { setStatus } = cancelLimitSlice.actions;

export const selectCancelLimitReducer = (state: RootState) => state.cancelLimit;
export const selectCancelLimitStatus = (state: RootState) =>
  state.cancelLimit.status;

export default cancelLimitSlice.reducer;
