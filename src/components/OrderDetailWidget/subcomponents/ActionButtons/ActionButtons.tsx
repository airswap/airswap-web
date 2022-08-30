import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { BackButton, Container, SignButton } from "./ActionButtons.styles";

type ActionButtonsProps = {
  hasInsufficientBalance: boolean;
  isMakerOfSwap: boolean;
  isIntendedRecipient: boolean;
  onBackButtonClick: () => void;
  onSignButtonClick: () => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientBalance,
  isMakerOfSwap,
  isIntendedRecipient,
  onBackButtonClick,
  onSignButtonClick,
}) => {
  const { t } = useTranslation();

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
        {(isMakerOfSwap && t("common.cancel")) ||
          (hasInsufficientBalance
            ? t("orders.insufficentBalance")
            : t("common.sign"))}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
