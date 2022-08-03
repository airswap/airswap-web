import { useEffect } from "react";

export function useKeyPress(callback: () => void, keyCodes: string[]): void {
  const handleKeydown = ({ code }: KeyboardEvent) => {
    if (keyCodes.includes(code)) {
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
