import { createSlice } from "@reduxjs/toolkit";

import { ThemeType } from "styled-components/macro";

import { RootState } from "../../app/store";
import getInitialBookmarkWarning from "./helpers/getInitialBookmarkWarning";
import getInitialThemeValue from "./helpers/getInitialThemeValue";

export interface UserSettingsState {
  theme: ThemeType;
  showBookmarkWarning: boolean;
}

export const THEME_LOCAL_STORAGE_KEY = "airswap/theme";
export const BOOKMARK_WARNING_LOCAL_STORAGE_KEY =
  "airswap/show-bookmark-warning";

const initialState: UserSettingsState = {
  theme: getInitialThemeValue(),
  showBookmarkWarning: getInitialBookmarkWarning(),
};

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState,
  reducers: {
    disableBookmarkWarning: (state) => {
      const showBookmarkWarning: boolean = false;
      localStorage[BOOKMARK_WARNING_LOCAL_STORAGE_KEY] = "disabled";
      state.showBookmarkWarning = showBookmarkWarning;
    },
    toggleTheme: (state) => {
      const theme: ThemeType = state.theme === "dark" ? "light" : "dark";
      localStorage[THEME_LOCAL_STORAGE_KEY] = theme;
      state.theme = theme;
    },
  },
});

export const selectUserSettings = (state: RootState) => state.userSettings;

export const {
  toggleTheme,
  disableBookmarkWarning,
} = userSettingsSlice.actions;

export default userSettingsSlice.reducer;
