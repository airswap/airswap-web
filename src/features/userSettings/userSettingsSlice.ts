import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ThemeType } from "styled-components/macro";

import { RootState } from "../../app/store";

export interface UserTokenPair {
  tokenFrom?: string;
  tokenTo?: string;
}

export interface UserSettingsState {
  theme: ThemeType | "system";
  tokens: UserTokenPair;
  customServerUrl: string | null;
}

export const THEME_LOCAL_STORAGE_KEY = "airswap/theme";

const initialState: UserSettingsState = {
  theme: localStorage[THEME_LOCAL_STORAGE_KEY] || "dark",
  tokens: {
    tokenFrom: undefined,
    tokenTo: undefined,
  },
  customServerUrl: null,
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
      action: PayloadAction<{ tokenFrom?: string; tokenTo?: string }>
    ) => {
      const tokens = {
        ...state.tokens,
        ...(action.payload.tokenFrom && {
          tokenFrom: action.payload.tokenFrom,
        }),
        ...(action.payload.tokenTo && { tokenTo: action.payload.tokenTo }),
      };

      return {
        ...state,
        tokens,
      };
    },
    setCustomServerUrl: (state, action: PayloadAction<string | null>) => {
      state.customServerUrl = action.payload;
    },
  },
});

export const selectTheme = (state: RootState) => state.userSettings.theme;

export const selectUserTokens = (state: RootState) => state.userSettings.tokens;

export const selectCustomServerUrl = (state: RootState) =>
  state.userSettings.customServerUrl;

export const { setTheme, setUserTokens, setCustomServerUrl } =
  userSettingsSlice.actions;

export default userSettingsSlice.reducer;
