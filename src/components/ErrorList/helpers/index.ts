import i18n from "i18next";

import { AppError, AppErrorType } from "../../../errors/appError";
import { ErrorListItemProps } from "../subcomponents/ErrorListItem/ErrorListItem";

export const getAppErrorTranslation = (error: AppError): ErrorListItemProps => {
  if (error.type === AppErrorType.invalidAddress) {
    return {
      title: AppErrorType.invalidAddress,
      text: i18n.t("validatorErrors.invalidAddress", {
        address: error.argument,
      }),
    };
  }

  if (error.type === AppErrorType.invalidValue) {
    return {
      title: AppErrorType.invalidValue,
      text: i18n.t("validatorErrors.invalidValue", { address: error.argument }),
    };
  }

  if (error.type === AppErrorType.unauthorized) {
    return {
      title: AppErrorType.unauthorized,
      text: i18n.t("validatorErrors.unauthorized"),
    };
  }

  return {
    title: AppErrorType.unknownError,
    text: i18n.t("validatorErrors.unknownError"),
  };
};
