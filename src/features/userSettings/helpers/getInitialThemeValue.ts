import { ThemeType } from "styled-components/macro";

import { THEME_LOCAL_STORAGE_KEY } from "../userSettingsSlice";

export default function getInitialThemeValue(): ThemeType {
  if (localStorage[THEME_LOCAL_STORAGE_KEY] === "dark") {
    return "dark";
  }

  if (localStorage[THEME_LOCAL_STORAGE_KEY] === "light") {
    return "light";
  }

  return "dark";
}
