import classNames from "classnames";
import { useEffect, useState } from "react";
import { RiSunLine, RiMoonLine } from "react-icons/ri";

const THEME_LOCAL_STORAGE_KEY = "airswap/theme";

function enableDarkMode(): void {
  document.documentElement.classList.add("dark");
  localStorage[THEME_LOCAL_STORAGE_KEY] = "dark";
}

function disableDarkMode(): void {
  document.documentElement.classList.remove("dark");
  localStorage[THEME_LOCAL_STORAGE_KEY] = "light";
}

// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (
  localStorage[THEME_LOCAL_STORAGE_KEY] === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  enableDarkMode();
} else {
  disableDarkMode();
}

type DarkModeProps = {
  className?: string;
};

// Whenever the user explicitly chooses to respect the OS preference
// localStorage.removeItem('theme')
const DarkModeSwitch = ({ className }: DarkModeProps): JSX.Element => {
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>();

  useEffect(() => {
    setDarkModeEnabled(localStorage[THEME_LOCAL_STORAGE_KEY] === "dark");
  }, []);

  return (
    <button
      onClick={() => {
        if (darkModeEnabled) disableDarkMode();
        else enableDarkMode();
        setDarkModeEnabled((toggle) => !toggle);
      }}
      className={classNames("px-4 py-2 text-2xl", className)}
    >
      {darkModeEnabled ? (
        <RiMoonLine className="-m-2" />
      ) : (
        <RiSunLine className="-m-2" />
      )}
    </button>
  );
};

export default DarkModeSwitch;
