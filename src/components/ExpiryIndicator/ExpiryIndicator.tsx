import React, { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { compareAsc, format } from "date-fns";

import { getExpiryTranslation } from "../../helpers/getExpiryTranslation";
import {
  Container,
  Strong,
  StyledPill,
  StyledTooltip,
  Text,
} from "./ExpiryIndicator.styles";

type ExpiryIndicatorProps = {
  expiry: Date;
  className?: string;
};

const ExpiryIndicator: FC<ExpiryIndicatorProps> = ({ expiry, className }) => {
  const { t } = useTranslation();

  const [timeLeft, setTimeLeft] = useState(
    getExpiryTranslation(new Date(), expiry)
  );

  const hasExpired = useMemo(
    () => compareAsc(new Date(), expiry) === 1,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expiry, timeLeft]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getExpiryTranslation(new Date(), expiry));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiry]);

  return (
    <Container className={className}>
      <StyledPill>
        <Text hasExpired={hasExpired}>
          {hasExpired ? t("common.expired") : t("common.expiresIn")}
        </Text>
        {!hasExpired && <Strong>{timeLeft}</Strong>}
      </StyledPill>
      <StyledTooltip>{format(expiry, "dd-MMM-yyyy pppp")}</StyledTooltip>
    </Container>
  );
};

export default ExpiryIndicator;
