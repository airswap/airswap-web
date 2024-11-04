import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getOrderExpiryWithBufferInSeconds } from "../../../../../entities/OrderERC20/OrderERC20Helpers";
import { Container, StyledTimer } from "./QuoteText.styles";

interface QuoteTextProps {
  isGasFreeTrade: boolean;
  expiry?: string;
  className?: string;
}

const QuoteText: FC<QuoteTextProps> = ({
  isGasFreeTrade,
  expiry,
  className,
}) => {
  const { t } = useTranslation();

  const expiryTime = useMemo(() => {
    console.log("expiry", expiry);
    return expiry ? getOrderExpiryWithBufferInSeconds(expiry) : undefined;
  }, [expiry]);

  if (isGasFreeTrade) {
    return (
      <Container className={className}>{t("orders.gasFreeTrade")}</Container>
    );
  }

  return (
    <Container className={className}>
      {t("orders.newQuoteIn")}:
      {expiryTime && <StyledTimer expiryTime={expiryTime} />}
    </Container>
  );
};

export default QuoteText;
