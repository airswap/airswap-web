import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { BackButton, Container, SignButton } from "./ActionButtons.styles";

type ActionButtonsProps = {
  onBackButtonClick: () => void;
  onSignButtonClick: () => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  onBackButtonClick,
  onSignButtonClick,
}) => {
  const { t } = useTranslation();

  return (
    <Container>
      <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
      <SignButton intent="primary" onClick={onSignButtonClick}>
        {t("common.sign")}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
