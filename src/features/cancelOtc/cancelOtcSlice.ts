import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { AppError } from "../../errors/appError";

export interface CancelOtcState {
  cancelInProgress: boolean;
  errors: AppError | null;
}

const initialState: CancelOtcState = {
  cancelInProgress: false,
  errors: null,
};

export const cancelOtcSlice = createSlice({
  name: "cancel-otc",
  initialState,
  reducers: {
    setCancelInProgress: (
      state,
      action: PayloadAction<CancelOtcState["cancelInProgress"]>
    ): CancelOtcState => {
      return {
        ...state,
        cancelInProgress: action.payload,
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

export const { setCancelInProgress, setErrors, reset } = cancelOtcSlice.actions;

export const selectCancelOtcReducer = (state: RootState) => state.cancelOtc;

export default cancelOtcSlice.reducer;
