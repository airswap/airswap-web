import React, { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import {
  BackButton,
  Container,
  SignButton,
} from "./ReviewActionButtons.styles";

interface ActionButtonsProps {
  onEditButtonClick: () => void;
  onSignButtonClick: () => void;
  className?: string;
}

const ReviewActionButtons: FC<ActionButtonsProps> = ({
  onEditButtonClick,
  onSignButtonClick,
  className = "",
}): ReactElement => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <BackButton onClick={onEditButtonClick}>{t("common.edit")}</BackButton>
      <SignButton intent="primary" onClick={onSignButtonClick}>
        {t("common.sign")}
      </SignButton>
    </Container>
  );
};

export default ReviewActionButtons;
