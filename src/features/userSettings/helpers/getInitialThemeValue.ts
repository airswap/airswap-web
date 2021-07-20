import { THEME_LOCAL_STORAGE_KEY } from '../userSettingsSlice';
import { ThemeType } from '../../../style/themes';

export default function getInitialThemeValue(): ThemeType {
  if (localStorage[THEME_LOCAL_STORAGE_KEY] === ThemeType.dark) {
    return ThemeType.dark;
  }

  if (localStorage[THEME_LOCAL_STORAGE_KEY] === ThemeType.light) {
    return ThemeType.light;
  }

  return ThemeType.dark;
}
