import { useMemo } from "react";

import stringToSignificantDecimals from "../helpers/stringToSignificantDecimals";

const useStringToSignificantDecimals = (
  input: string,
  sigDecimals?: number,
  length?: number
): string => {
  return useMemo(() => {
    return stringToSignificantDecimals(input, sigDecimals, length);
  }, [input, sigDecimals, length]);
};

export default useStringToSignificantDecimals;
