import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { compareAsc, format } from "date-fns";

import {
  Container,
  Strong,
  StyledPill,
  StyledTooltip,
} from "./ExpiryIndicator.styles";
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
    <Container>
      <StyledPill>
        {hasPassed ? t("common.expired") : t("common.expiresIn")}
        {!hasPassed && <Strong>{timeLeft}</Strong>}
      </StyledPill>
      <StyledTooltip>{format(expiry, "dd-MMM-yyyy pppp")}</StyledTooltip>
    </Container>
  );
};

export default ExpiryIndicator;
