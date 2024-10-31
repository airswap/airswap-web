import { RefObject, useEffect, useState } from "react";

interface Size {
  width: number;
  height: number;
  scrollWidth: number;
  scrollHeight: number;
  top: number;
}

const useElementSize = (
  ref: RefObject<HTMLElement>,
  deps = [] as unknown[]
): Size => {
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    top: 0,
  });

  let resizeObserver: ResizeObserver;

  useEffect(
    (): (() => void) => {
      resizeObserver = new ResizeObserver((entries): void => {
        for (let i = 0; i < entries.length; i += 1) {
          const entry = entries[i];

          const { scrollWidth, scrollHeight } = entry.target;
          const { width, height, top } = entry.target.getBoundingClientRect();

          // Use requestAnimationFrame to batch updates to prevent resizeObserver lost event error
          requestAnimationFrame(() => {
            setSize({ width, height, scrollWidth, scrollHeight, top });
          });
        }
      });

      if (ref.current) {
        resizeObserver.observe(ref.current);
      }

      return (): void => {
        resizeObserver.disconnect();
      };
    },
    deps ? [ref, ...deps] : [ref]
  );

  return size;
};

export default useElementSize;
