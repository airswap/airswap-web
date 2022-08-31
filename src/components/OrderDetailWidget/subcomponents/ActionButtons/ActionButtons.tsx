import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { ButtonActions } from "../../../MakeWidget/subcomponents/ActionButtons/ActionButtons";
import { BackButton, Container, SignButton } from "./ActionButtons.styles";

type ActionButtonsProps = {
  hasInsufficientBalance: boolean;
  isMakerOfSwap: boolean;
  isIntendedRecipient: boolean;
  isNotConnected: boolean;
  networkIsUnsupported: boolean;
  onBackButtonClick: () => void;
  onCancelButtonClick: () => void;
  onSignButtonClick: (action: ButtonActions) => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientBalance,
  isMakerOfSwap,
  isIntendedRecipient,
  isNotConnected,
  networkIsUnsupported,
  onCancelButtonClick,
  onBackButtonClick,
  onSignButtonClick,
}) => {
  const { t } = useTranslation();

  const signButtonText = () => {
    if (networkIsUnsupported) {
      return t("wallet.switchNetwork");
    }

    if (isNotConnected) {
      return t("wallet.connectWallet");
    }

    if (isMakerOfSwap) {
      return t("common.cancel");
    }

    if (hasInsufficientBalance) {
      return t("orders.insufficentBalance");
    }

    return t("common.sign");
  };

  const handleClick = () => {
    if (networkIsUnsupported) {
      return onSignButtonClick(ButtonActions.switchNetwork);
    }

    if (isNotConnected) {
      return onSignButtonClick(ButtonActions.connectWallet);
    }

    if (isMakerOfSwap) {
      return onCancelButtonClick();
    }

    return t("common.sign");
  };

  return (
    <Container>
      <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
      <SignButton
        intent="primary"
        onClick={handleClick}
        disabled={
          (hasInsufficientBalance || !isIntendedRecipient) && !isMakerOfSwap
        }
      >
        {signButtonText()}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
