import { RefObject, useCallback, useEffect, useState } from "react";

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

  // Add debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Create a memoized, debounced version of setSize
  const debouncedSetSize = useCallback(
    debounce((newSize: Size) => {
      setSize(newSize);
    }, 100),
    []
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: More dependencies not needed
  useEffect(
    (): (() => void) => {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { scrollWidth, scrollHeight } = entry.target;
          const { width, height, top } = entry.target.getBoundingClientRect();

          debouncedSetSize({ width, height, scrollWidth, scrollHeight, top });
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
