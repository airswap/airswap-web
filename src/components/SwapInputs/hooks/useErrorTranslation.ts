import { AppError, AppErrorType } from "../../../errors/appError";
import i18n from "i18next";
import { useMemo } from "react";

const useErrorTranslation = (error?: AppError): string | undefined => {
  return useMemo(() => {
    if (!error) {
      return undefined;
    }

    if (error.type === AppErrorType.arithmeticUnderflow) {
      return i18n.t("validatorErrors.arithmeticUnderflow");
    }

    if (error.type === AppErrorType.invalidValue) {
      return i18n.t("validatorErrors.arithmeticUnderflow");
    }

    return i18n.t("validatorErrors.unknownError");
  }, [error]);
};

export default useErrorTranslation;
