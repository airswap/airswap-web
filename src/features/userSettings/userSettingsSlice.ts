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
    setTheme: (state, { payload }) => {
      // if the user perfers dark color scheme and they are currently on light mode -> switch to dark
      if (payload === "system") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          if (state.theme === "light") {
            localStorage[THEME_LOCAL_STORAGE_KEY] = "dark";
            state.theme = payload;
          }
        } else {
          if (state.theme === "dark") {
            localStorage[THEME_LOCAL_STORAGE_KEY] = "light";
            state.theme = payload;
          }
        }
      } else {
        localStorage[THEME_LOCAL_STORAGE_KEY] = payload;
        state.theme = payload;
      }
    },
  },
});

export const selectUserSettings = (state: RootState) => state.userSettings;

export const { toggleTheme, setTheme } = userSettingsSlice.actions;

export default userSettingsSlice.reducer;
