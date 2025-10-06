import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { DelegateRule } from "../../entities/DelegateRule/DelegateRule";
import { AppError } from "../../errors/appError";

export interface TakeLimitOrderState {
  status:
    | "idle"
    | "invalid"
    | "not-found"
    | "open"
    | "taken"
    | "signing-signature"
    | "signing-transaction"
    | "failed";
  errors: AppError[];
  delegateRule?: DelegateRule;
}

const initialState: TakeLimitOrderState = {
  status: "idle",
  errors: [],
};

export const takeLimitSlice = createSlice({
  name: "take-limit",
  initialState,
  reducers: {
    setDelegateRule: (state, action: PayloadAction<DelegateRule>) => {
      return {
        ...state,
        delegateRule: action.payload,
      };
    },
    reset: () => {
      return initialState;
    },
    setError: (state, action: PayloadAction<AppError>) => {
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };
    },
    setStatus: (
      state,
      action: PayloadAction<TakeLimitOrderState["status"]>
    ) => {
      return {
        ...state,
        status: action.payload,
      };
    },
  },
});

export const { setDelegateRule, reset, setStatus, setError } =
  takeLimitSlice.actions;

export const selectTakeLimitErrors = (state: RootState) =>
  state.takeLimit.errors;
export const selectTakeLimitStatus = (state: RootState) =>
  state.takeLimit.status;

export default takeLimitSlice.reducer;
