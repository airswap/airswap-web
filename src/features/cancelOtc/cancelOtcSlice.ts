import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { AppError } from "../../errors/appError";

export interface CancelOtcState {
  cancelState: "idle" | "in-progress" | "success";
  errors: AppError | null;
}

const initialState: CancelOtcState = {
  cancelState: "idle",
  errors: null,
};

export const cancelOtcSlice = createSlice({
  name: "cancel-otc",
  initialState,
  reducers: {
    setCancelState: (
      state,
      action: PayloadAction<CancelOtcState["cancelState"]>
    ): CancelOtcState => {
      return {
        ...state,
        cancelState: action.payload,
      };
    },
    setErrors: (state, action: PayloadAction<AppError>): CancelOtcState => {
      return {
        ...state,
        errors: action.payload,
      };
    },
    reset: (): CancelOtcState => {
      return initialState;
    },
  },
});

export const { setCancelState, setErrors, reset } = cancelOtcSlice.actions;

export const selectCancelOtcReducer = (state: RootState) => state.cancelOtc;

export default cancelOtcSlice.reducer;
