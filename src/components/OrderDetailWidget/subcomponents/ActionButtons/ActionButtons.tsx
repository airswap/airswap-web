import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { OrderType } from "../../../../types/orderTypes";
import { BackButton, Container, SignButton } from "./ActionButtons.styles";

export enum ButtonActions {
  connectWallet,
  switchNetwork,
  reloadPage,
  restart,
  cancel,
  sign,
  approve,
}

type ActionButtonsProps = {
  hasInsufficientAllowance: boolean;
  hasInsufficientBalance: boolean;
  isExpired: boolean;
  isTaken: boolean;
  isDifferentChainId: boolean;
  isIntendedRecipient: boolean;
  isLoading: boolean;
  isMakerOfSwap: boolean;
  orderType: OrderType;
  isNotConnected: boolean;
  networkIsUnsupported: boolean;
  senderTokenSymbol?: string;
  onBackButtonClick: () => void;
  onActionButtonClick: (action: ButtonActions) => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientAllowance,
  hasInsufficientBalance,
  isExpired,
  isTaken,
  isDifferentChainId,
  isIntendedRecipient,
  isLoading,
  isMakerOfSwap,
  orderType,
  isNotConnected,
  networkIsUnsupported,
  senderTokenSymbol,
  onBackButtonClick,
  onActionButtonClick,
}) => {
  const { t } = useTranslation();
  const isPrivate = orderType === OrderType.private;
  const buttonDisabled =
    (hasInsufficientBalance ||
      (!isIntendedRecipient && !isMakerOfSwap) ||
      isDifferentChainId) &&
    !isNotConnected &&
    !isTaken &&
    !isExpired;

  const signButtonText = () => {
    if (networkIsUnsupported) {
      return t("wallet.switchNetwork");
    }

    if (isNotConnected) {
      return t("wallet.connectWallet");
    }

    if (isExpired || isTaken) {
      return t("orders.newSwap");
    }

    if (isMakerOfSwap) {
      return t("orders.cancelSwap");
    }

    if (!isIntendedRecipient) {
      return t("orders.unableTake");
    }

    if (hasInsufficientBalance) {
      return t("orders.insufficentBalance");
    }

    if (hasInsufficientAllowance) {
      return `${t("orders.approve")} ${senderTokenSymbol || ""}`;
    }

    return t("orders.takeOtc");
  };

  const handleActionButtonClick = () => {
    if (networkIsUnsupported) {
      return onActionButtonClick(ButtonActions.switchNetwork);
    }

    if (isNotConnected) {
      return onActionButtonClick(ButtonActions.connectWallet);
    }

    if (isExpired) {
      return onActionButtonClick(ButtonActions.restart);
    }

    if (isMakerOfSwap) {
      return onActionButtonClick(ButtonActions.cancel);
    }

    if (hasInsufficientAllowance) {
      return onActionButtonClick(ButtonActions.approve);
    }

    return onActionButtonClick(ButtonActions.sign);
  };

  return (
    <Container>
      {!isNotConnected &&
        ((isPrivate && !isExpired) || !isPrivate || isTaken) && (
          <BackButton onClick={onBackButtonClick}>
            {isPrivate && !isIntendedRecipient && !isTaken
              ? t("orders.newSwap")
              : t("common.back")}
          </BackButton>
        )}
      <SignButton
        isFilled={isNotConnected || (isPrivate && isExpired)}
        intent={buttonDisabled ? "neutral" : "primary"}
        disabled={buttonDisabled}
        loading={isLoading}
        onClick={handleActionButtonClick}
      >
        {signButtonText()}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
