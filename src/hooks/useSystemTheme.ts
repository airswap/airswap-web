import { useEffect, useState } from "react";

import { ThemeType } from "styled-components/macro";

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

// TODO: Remember to restore light mode

const useSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState<ThemeType>(
    mediaQuery.matches ? "dark" : "dark"
  );
  useEffect(() => {
    function listener(e: MediaQueryListEvent) {
      setSystemTheme(e.matches ? "dark" : "dark");
    }
    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  return systemTheme;
};

export default useSystemTheme;
