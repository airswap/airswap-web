import { createSlice } from "@reduxjs/toolkit";

import { ThemeType } from "styled-components/macro";

import { RootState } from "../../app/store";
import getInitialThemeValue from "./helpers/getInitialThemeValue";

export interface UserSettingsState {
  theme: ThemeType;
}

export const THEME_LOCAL_STORAGE_KEY = "airswap/theme";

const initialState: UserSettingsState = {
  theme: getInitialThemeValue(),
};

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const theme: ThemeType = state.theme === "dark" ? "light" : "dark";
      localStorage[THEME_LOCAL_STORAGE_KEY] = theme;
      state.theme = theme;
    },
  },
});

export const selectUserSettings = (state: RootState) => state.userSettings;

export const { toggleTheme } = userSettingsSlice.actions;

export default userSettingsSlice.reducer;
