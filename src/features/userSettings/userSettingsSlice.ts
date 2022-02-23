import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ThemeType } from "styled-components/macro";

import { RootState } from "../../app/store";

export interface UserSettingsState {
  theme: ThemeType | "system";
  tokens: {
    tokenFrom?: string;
    tokenTo?: string;
  };
}

export const THEME_LOCAL_STORAGE_KEY = "airswap/theme";

const initialState: UserSettingsState = {
  theme: localStorage[THEME_LOCAL_STORAGE_KEY] || "dark",
  tokens: {
    tokenFrom: undefined,
    tokenTo: undefined,
  },
};

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState,
  reducers: {
    setTheme: (state, { payload }) => {
      localStorage[THEME_LOCAL_STORAGE_KEY] = payload;
      state.theme = payload;
    },
    setUserTokens: (
      state,
      action: PayloadAction<{ tokenFrom: string; tokenTo: string }>
    ) => {
      state.tokens = action.payload;
    },
  },
});

export const selectTheme = (state: RootState) => state.userSettings.theme;

export const selectUserTokens = (state: RootState) => state.userSettings.tokens;

export const { setTheme, setUserTokens } = userSettingsSlice.actions;

export default userSettingsSlice.reducer;
