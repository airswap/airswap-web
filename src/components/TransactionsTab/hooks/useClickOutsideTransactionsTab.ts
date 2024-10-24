import { useEffect, useState } from "react";

import { useClickAnyWhere, useMediaQuery } from "usehooks-ts";

import useWindowSize from "../../../hooks/useWindowSize";
import breakPoints from "../../../style/breakpoints";

const desktopWidth = 460;

const useClickOutsideTransactionsTab = (callback: () => void) => {
  const [clickedOutside, setClickedOutside] = useState(false);
  const isMobile = useMediaQuery(breakPoints.phoneOnly);

  const { width: windowWidth } = useWindowSize();

  useClickAnyWhere((e: MouseEvent) => {
    if (!windowWidth || isMobile) return;

    if (e.clientX < windowWidth - desktopWidth) {
      setClickedOutside(true);
    } else {
      setClickedOutside(false);
    }
  });

  useEffect(() => {
    if (clickedOutside) {
      callback();
    }
  }, [clickedOutside]);

  return { clickedOutside };
};

export default useClickOutsideTransactionsTab;
