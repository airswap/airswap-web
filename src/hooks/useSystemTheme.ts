import { useEffect, useState } from "react";

import { ThemeType } from "styled-components/macro";

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const useSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState<ThemeType>(
    mediaQuery.matches ? "dark" : "light"
  );
  useEffect(() => {
    function listener(e: MediaQueryListEvent) {
      setSystemTheme(e.matches ? "dark" : "light");
    }
    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  return systemTheme;
};

export default useSystemTheme;
