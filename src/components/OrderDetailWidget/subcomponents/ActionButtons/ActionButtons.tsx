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
  isCanceled: boolean;
  isExpired: boolean;
  isTaken: boolean;
  isDifferentChainId: boolean;
  isIntendedRecipient: boolean;
  isLoading: boolean;
  isMakerOfSwap: boolean;
  isNotConnected: boolean;
  isOrderSubmitted: boolean;
  orderType: OrderType;
  networkIsUnsupported: boolean;
  senderTokenSymbol?: string;
  onBackButtonClick: () => void;
  onActionButtonClick: (action: ButtonActions) => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientAllowance,
  hasInsufficientBalance,
  isCanceled,
  isExpired,
  isTaken,
  isDifferentChainId,
  isIntendedRecipient,
  isLoading,
  isMakerOfSwap,
  isNotConnected,
  isOrderSubmitted,
  networkIsUnsupported,
  orderType,
  senderTokenSymbol,
  onBackButtonClick,
  onActionButtonClick,
}) => {
  const { t } = useTranslation();
  const isPrivate = orderType === OrderType.private;
  const buttonDisabled =
    ((hasInsufficientBalance && !isMakerOfSwap) ||
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

    if (isExpired || isTaken || isCanceled) {
      return t("orders.makeNewOrder");
    }

    if (isMakerOfSwap) {
      return t("orders.cancelOrder");
    }

    if (!isIntendedRecipient) {
      return t("orders.unableTake");
    }

    if (isOrderSubmitted) {
      return t("orders.makeNewOrder");
    }

    if (hasInsufficientBalance) {
      return t("orders.insufficientBalance");
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

    if (isOrderSubmitted || isExpired || isTaken || isCanceled) {
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
        !isOrderSubmitted &&
        ((isPrivate && !isExpired) || !isPrivate || isTaken) && (
          <BackButton onClick={onBackButtonClick}>
            {isPrivate && !isIntendedRecipient && !isTaken
              ? t("orders.makeNewOrder")
              : t("common.back")}
          </BackButton>
        )}
      <SignButton
        isFilled={
          isNotConnected || isOrderSubmitted || (isPrivate && isExpired)
        }
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
