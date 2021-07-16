import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import getInitialThemeValue from './helpers/getInitialThemeValue';
import { ThemeType } from '../../style/themes';

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
    toggleTheme: (
      state,
    ) => {
      const theme  = state.theme === ThemeType.dark ? ThemeType.light : ThemeType.dark;
      localStorage[THEME_LOCAL_STORAGE_KEY] = theme
      state.theme = theme;
    },
  },
});

export const selectUserSettings = (state: RootState) => state.userSettings;

export const { toggleTheme } = userSettingsSlice.actions;

export default userSettingsSlice.reducer;
