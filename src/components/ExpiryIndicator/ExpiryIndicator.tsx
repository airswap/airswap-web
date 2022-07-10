import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { Container, Label, Strong } from "./ExpiryIndicator.styles";

type ExpiryIndicatorProps = {
  expiry: Date;
};

const ExpiryIndicator: FC<ExpiryIndicatorProps> = ({ expiry }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Label>
        {t("orders.expiresIn")}
        <Strong>12H</Strong>
      </Label>
    </Container>
  );
};

export default ExpiryIndicator;
