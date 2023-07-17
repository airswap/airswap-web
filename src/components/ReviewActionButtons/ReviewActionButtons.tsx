import React, { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import {
  BackButton,
  Container,
  SignButton,
} from "./ReviewActionButtons.styles";

interface ActionButtonsProps {
  isLoading?: boolean;
  onEditButtonClick: () => void;
  onSignButtonClick: () => void;
  className?: string;
}

const ReviewActionButtons: FC<ActionButtonsProps> = ({
  isLoading = false,
  onEditButtonClick,
  onSignButtonClick,
  className = "",
}): ReactElement => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <BackButton onClick={onEditButtonClick}>{t("common.edit")}</BackButton>
      <SignButton
        loading={isLoading}
        intent="primary"
        onClick={onSignButtonClick}
      >
        {t("common.sign")}
      </SignButton>
    </Container>
  );
};

export default ReviewActionButtons;
