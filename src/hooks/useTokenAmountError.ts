import { useMemo } from "react";

import { TokenInfo } from "@airswap/typescript";
import { toAtomicString } from "@airswap/utils";

import {
  AppError,
  AppErrorType,
  transformToAppError,
} from "../errors/appError";
import {
  isEthersProjectError,
  transformEthersProjectErrorToAppError,
} from "../errors/ethersProjectError";
import {
  isNumericFaultErrorError,
  transformNumericFaultErrorErrorToAppError,
} from "../errors/numericFaultError";

const useTokenAmountError = (
  tokenInfo: TokenInfo | null,
  amount: string
): AppError | undefined => {
  return useMemo(() => {
    if (!tokenInfo || !amount) {
      return undefined;
    }

    try {
      toAtomicString(amount, tokenInfo.decimals);
      return undefined;
    } catch (error: any) {
      if (isNumericFaultErrorError(error)) {
        return transformNumericFaultErrorErrorToAppError(error);
      }

      if (isEthersProjectError(error)) {
        return transformEthersProjectErrorToAppError(error);
      }

      return transformToAppError(AppErrorType.unknownError, error);
    }
  }, [tokenInfo, amount]);
};

export default useTokenAmountError;
