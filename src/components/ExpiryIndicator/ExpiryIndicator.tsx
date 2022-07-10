import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { compareAsc } from "date-fns";

import { Pill } from "../../styled-components/Pill/Pill";
import { Strong } from "./ExpiryIndicator.styles";
import { getExpiryTranslation } from "./helpers";

type ExpiryIndicatorProps = {
  expiry: Date;
};

const ExpiryIndicator: FC<ExpiryIndicatorProps> = ({ expiry }) => {
  const { t } = useTranslation();

  const hasPassed = useMemo(
    () => compareAsc(new Date(), expiry) === 1,
    [expiry]
  );
  const timeLeft = useMemo(
    () => getExpiryTranslation(new Date(), expiry, t),
    [expiry, t]
  );

  return (
    <Pill>
      {hasPassed ? t("orders.expired") : t("orders.expiresIn")}
      {!hasPassed && <Strong>{timeLeft}</Strong>}
    </Pill>
  );
};

export default ExpiryIndicator;
