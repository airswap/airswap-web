import { useRef, useEffect } from "react";

const useAutoFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return inputRef;
};

export default useAutoFocus;
