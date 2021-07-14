import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import getInitialThemeValue from './helpers/getInitialThemeValue';

export enum ThemeType {
  dark = "dark",
  light = "light",
}

export interface UserSettingsState {
  theme: ThemeType;
}

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
      state.theme = state.theme === ThemeType.dark ? ThemeType.light : ThemeType.dark;
    },
  },
});

export const selectUserSettings = (state: RootState) => state.userSettings;

export const { toggleTheme } = userSettingsSlice.actions;

export default userSettingsSlice.reducer;
