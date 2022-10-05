import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { OrderType } from "../../../../types/orderTypes";
import { ButtonActions } from "../../../MakeWidget/subcomponents/ActionButtons/ActionButtons";
import { BackButton, Container, SignButton } from "./ActionButtons.styles";

type ActionButtonsProps = {
  hasInsufficientBalance: boolean;
  isExpired: boolean;
  isTaken: boolean;
  isDifferentChainId: boolean;
  isIntendedRecipient: boolean;
  isMakerOfSwap: boolean;
  orderType: OrderType;
  isNotConnected: boolean;
  networkIsUnsupported: boolean;
  onBackButtonClick: () => void;
  onCancelButtonClick: () => void;
  onSignButtonClick: (action: ButtonActions) => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientBalance,
  isExpired,
  isTaken,
  isDifferentChainId,
  isIntendedRecipient,
  isMakerOfSwap,
  orderType,
  isNotConnected,
  networkIsUnsupported,
  onCancelButtonClick,
  onBackButtonClick,
  onSignButtonClick,
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

    return t("orders.takeOtc");
  };

  const handleActionButtonClick = () => {
    if (networkIsUnsupported) {
      return onSignButtonClick(ButtonActions.switchNetwork);
    }

    if (isNotConnected) {
      return onSignButtonClick(ButtonActions.connectWallet);
    }

    if (isExpired || isTaken) {
      return onSignButtonClick(ButtonActions.restart);
    }

    if (isMakerOfSwap) {
      return onCancelButtonClick();
    }

    return onSignButtonClick(ButtonActions.sign);
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
        intent={buttonDisabled ? "neutral" : "primary"}
        onClick={handleActionButtonClick}
        disabled={buttonDisabled}
        $fill={isNotConnected || (isPrivate && isExpired)}
      >
        {signButtonText()}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
