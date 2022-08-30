import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { BackButton, Container, SignButton } from "./ActionButtons.styles";

type ActionButtonsProps = {
  hasInsufficientBalance: boolean;
  isMakerOfSwap: boolean;
  isIntendedRecipient: boolean;
  isNotConnected: boolean;
  onBackButtonClick: () => void;
  onSignButtonClick: () => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientBalance,
  isMakerOfSwap,
  isIntendedRecipient,
  isNotConnected,
  onBackButtonClick,
  onSignButtonClick,
}) => {
  const { t } = useTranslation();

  const signButtonText = () => {
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

  return (
    <Container>
      <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
      <SignButton
        intent="primary"
        onClick={onSignButtonClick}
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
