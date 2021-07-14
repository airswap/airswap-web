import { ThemeType } from '../userSettingsSlice';

const THEME_LOCAL_STORAGE_KEY = "airswap/theme";

export default function getInitialThemeValue(): ThemeType {
  if (localStorage[THEME_LOCAL_STORAGE_KEY] === ThemeType.dark) {
    return ThemeType.dark;
  }

  if (localStorage[THEME_LOCAL_STORAGE_KEY] === ThemeType.light) {
    return ThemeType.light;
  }

  return ThemeType.dark;
}
