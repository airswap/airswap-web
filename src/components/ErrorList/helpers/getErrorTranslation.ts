import {ErrorCodes, ErrorType} from "../../../constants/errors";
import { getMessageFromCode } from "eth-rpc-errors";

export default function getErrorTranslation(originalTranslation: string, keywords: string, error: ErrorType): string {
  if (originalTranslation !== keywords) {
    return originalTranslation;
  }

  const code = ErrorCodes[error];
  if (!code) {
    return originalTranslation;
  }

  return getMessageFromCode(code) || originalTranslation;
}