import { RefObject, useEffect, useState } from "react";
import { useWindowSize } from "react-use";

import useElementSize from "./useElementSize";

const useIsOverflowing = (ref: RefObject<HTMLElement>): [boolean, boolean] => {
  const [overflow, setOverflow] = useState<[boolean, boolean]>([false, false]);
  const { width, height } = useElementSize(ref);
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  useEffect(() => {
    if (ref.current) {
      const xOverflow = ref.current.scrollWidth > ref.current.clientWidth;
      const yOverflow = ref.current.scrollHeight > ref.current.clientHeight;
      setOverflow([xOverflow, yOverflow]);
    }
  }, [width, windowWidth, height, windowHeight]);

  return overflow;
};

export default useIsOverflowing;
