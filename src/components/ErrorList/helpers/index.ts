import i18n from "i18next";

import { AppError, AppErrorType } from "../../../errors/appError";
import { ErrorListItemProps } from "../subcomponents/ErrorListItem/ErrorListItem";

export const getAppErrorTranslation = (error: AppError): ErrorListItemProps => {
  if (error.type === AppErrorType.expiryPassed) {
    return {
      title: AppErrorType.expiryPassed,
      text: i18n.t("validatorErrors.expiryPassed"),
    };
  }

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

  if (error.type === AppErrorType.nonceAlreadyUsed) {
    return {
      title: AppErrorType.nonceAlreadyUsed,
      text: i18n.t("validatorErrors.nonceAlreadyUsed"),
    };
  }

  if (error.type === AppErrorType.senderAllowanceLow) {
    return {
      title: AppErrorType.senderAllowanceLow,
      text: i18n.t("validatorErrors.senderAllowanceLow"),
    };
  }

  if (error.type === AppErrorType.senderBalanceLow) {
    return {
      title: AppErrorType.senderBalanceLow,
      text: i18n.t("validatorErrors.senderBalanceLow"),
    };
  }

  if (error.type === AppErrorType.signerAllowanceLow) {
    return {
      title: AppErrorType.signerAllowanceLow,
      text: i18n.t("validatorErrors.signerAllowanceLow"),
    };
  }

  if (error.type === AppErrorType.signerBalanceLow) {
    return {
      title: AppErrorType.signerBalanceLow,
      text: i18n.t("validatorErrors.signerBalanceLow"),
    };
  }

  if (error.type === AppErrorType.unauthorized) {
    return {
      title: AppErrorType.unauthorized,
      text: i18n.t("validatorErrors.unauthorized"),
    };
  }

  if (error.type === AppErrorType.unpredictableGasLimit) {
    return {
      title: AppErrorType.unpredictableGasLimit,
      text: i18n.t("validatorErrors.unpredictableGasLimit"),
    };
  }

  if (error.type === AppErrorType.arithmeticUnderflow) {
    return {
      title: AppErrorType.arithmeticUnderflow,
      text: i18n.t("validatorErrors.arithmeticUnderflow"),
    };
  }

  return {
    title: AppErrorType.unknownError,
    text: i18n.t("validatorErrors.unknownError"),
  };
};
