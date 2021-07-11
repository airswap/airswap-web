import { useEffect, useState } from "react";
import Icon from '../Icon/Icon';

export const THEME_LOCAL_STORAGE_KEY = "airswap/theme";

export enum ThemeType {
  dark = "dark",
  light = "light",
}

function enableDarkMode(): void {
  localStorage[THEME_LOCAL_STORAGE_KEY] = ThemeType.dark;
}

function disableDarkMode(): void {
  localStorage[THEME_LOCAL_STORAGE_KEY] = ThemeType.light;
}

// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (
  localStorage[THEME_LOCAL_STORAGE_KEY] === ThemeType.dark ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  enableDarkMode();
} else {
  disableDarkMode();
}

type DarkModeProps = {
  className?: string;
  onClick: (theme: ThemeType) => void;
};

// Whenever the user explicitly chooses to respect the OS preference
// localStorage.removeItem('theme')
const DarkModeSwitch = ({ className, onClick }: DarkModeProps): JSX.Element => {
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>();

  useEffect(() => {
    setDarkModeEnabled(localStorage[THEME_LOCAL_STORAGE_KEY] === "dark");
  }, []);

  return (
    <button
      onClick={() => {
        if (darkModeEnabled) disableDarkMode();
        else enableDarkMode();
        console.log(darkModeEnabled);
        onClick(!darkModeEnabled ? ThemeType.dark : ThemeType.light)
        setDarkModeEnabled((toggle) => !toggle);
      }}
      className={className}
    >
      <Icon name="dark-mode-switch" />
    </button>
  );
};

export default DarkModeSwitch;
