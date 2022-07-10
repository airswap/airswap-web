import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { Pill } from "../../styled-components/Pill/Pill";
import { Strong } from "./ExpiryIndicator.styles";

type ExpiryIndicatorProps = {
  expiry: Date;
};

const ExpiryIndicator: FC<ExpiryIndicatorProps> = ({ expiry }) => {
  const { t } = useTranslation();

  return (
    <Pill>
      {t("orders.expiresIn")}
      <Strong>12H</Strong>
    </Pill>
  );
};

export default ExpiryIndicator;
