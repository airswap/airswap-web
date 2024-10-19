import { RefObject, useEffect, useState } from "react";
import { useWindowSize } from "react-use";

import useElementSize from "./useElementSize";

const useIsOverflowing = (
  ref: RefObject<HTMLElement>,
  deps = [] as unknown[]
): [boolean, boolean] => {
  const [overflow, setOverflow] = useState<[boolean, boolean]>([false, false]);
  const { width, height } = useElementSize(ref);
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to observe these variables for changes
  useEffect(() => {
    if (ref.current) {
      console.log(
        ref.current.firstChild,
        ref.current.scrollHeight,
        ref.current.clientHeight
      );
      const xOverflow = ref.current.scrollWidth > ref.current.clientWidth;
      const yOverflow = ref.current.scrollHeight > ref.current.clientHeight;
      setOverflow([xOverflow, yOverflow]);
    }
  }, [width, windowWidth, height, windowHeight, ...deps]);

  return overflow;
};

export default useIsOverflowing;
