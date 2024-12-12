import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getOrderExpiryWithBufferInSeconds } from "../../../../../entities/OrderERC20/OrderERC20Helpers";
import { InfoSectionHeading } from "../../../../../styled-components/InfoSection/InfoSection";
import { Container, GasFreeButton, StyledTimer } from "./QuoteText.styles";

interface QuoteTextProps {
  isGasFreeTrade: boolean;
  expiry?: string;
  onGasFreeTradeButtonClick: () => void;
  className?: string;
}

const QuoteText: FC<QuoteTextProps> = ({
  isGasFreeTrade,
  expiry,
  onGasFreeTradeButtonClick,
  className,
}) => {
  const { t } = useTranslation();

  const expiryTime = useMemo(() => {
    return expiry ? getOrderExpiryWithBufferInSeconds(expiry) : undefined;
  }, [expiry]);

  if (isGasFreeTrade) {
    return (
      <Container className={className}>
        <GasFreeButton onClick={onGasFreeTradeButtonClick}>
          {t("orders.gasFreeTrade")} ♻️
        </GasFreeButton>
      </Container>
    );
  }

  return (
    <Container className={className}>
      <InfoSectionHeading>{t("orders.newQuoteIn")}:</InfoSectionHeading>
      {expiryTime && <StyledTimer expiryTime={expiryTime} />}
    </Container>
  );
};

export default QuoteText;
