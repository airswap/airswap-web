import { toAtomicString as airswapToAtomicString } from "@airswap/utils";

import { ethers } from "ethers";

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

const toAtomicString = (
  value: string | ethers.BigNumber,
  decimals: string | number
): string | AppError => {
  try {
    return airswapToAtomicString(value, decimals);
  } catch (error: any) {
    if (isNumericFaultErrorError(error)) {
      return transformNumericFaultErrorErrorToAppError(error);
    }

    if (isEthersProjectError(error)) {
      return transformEthersProjectErrorToAppError(error);
    }

    return transformToAppError(AppErrorType.unknownError, error);
  }
};

export default toAtomicString;
