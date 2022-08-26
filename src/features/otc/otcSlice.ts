import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { ErrorType } from "../../constants/errors";

export interface OtcState {
  status: "idle" | "signing" | "taking" | "failed" | "reset";
  errors: ErrorType[];
}

const initialState: OtcState = {
  status: "idle",
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

export const { setStatus, setErrors, reset } = otcSlice.actions;

export const selectOtcStatus = (state: RootState) => state.otc.status;
export const selectOtcErrors = (state: RootState) => state.otc.errors;

export default otcSlice.reducer;
