import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { compareAsc, format } from "date-fns";

import {
  Container,
  Strong,
  StyledPill,
  StyledTooltip,
  Text,
} from "./ExpiryIndicator.styles";
import { getExpiryTranslation } from "./helpers";

type ExpiryIndicatorProps = {
  expiry: Date;
  className?: string;
};

const ExpiryIndicator: FC<ExpiryIndicatorProps> = ({ expiry, className }) => {
  const { t } = useTranslation();

  const hasExpired = useMemo(
    () => compareAsc(new Date(), expiry) === 1,
    [expiry]
  );
  const timeLeft = useMemo(
    () => getExpiryTranslation(new Date(), expiry, t),
    [expiry, t]
  );

  return (
    <Container className={className}>
      <StyledPill>
        <Text>{hasExpired ? t("common.expired") : t("common.expiresIn")}</Text>
        {!hasExpired && <Strong>{timeLeft}</Strong>}
      </StyledPill>
      <StyledTooltip>{format(expiry, "dd-MMM-yyyy pppp")}</StyledTooltip>
    </Container>
  );
};

export default ExpiryIndicator;
