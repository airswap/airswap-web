import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getOrderExpiryWithBufferInSeconds } from "../../../../../entities/OrderERC20/OrderERC20Helpers";
import { WidgetHeader } from "../../../../../styled-components/WidgetHeader/WidgetHeader";
import { Title } from "../../../../Typography/Typography";
import {
  Button,
  NewQuoteText,
  Quote,
  StyledIcon,
  StyledTimer,
} from "./SwapWidgetHeader.styles";

interface SwapWidgetHeaderProps {
  isLastLook: boolean;
  title: string;
  isQuote: boolean;
  onGasFreeTradeButtonClick: () => void;
  expiry?: string;
  className?: string;
}

const SwapWidgetHeader: FC<SwapWidgetHeaderProps> = ({
  isLastLook,
  title,
  isQuote,
  onGasFreeTradeButtonClick,
  expiry,
  className,
}) => {
  const { t } = useTranslation();

  const expiryTime = useMemo(() => {
    return expiry ? getOrderExpiryWithBufferInSeconds(expiry) : undefined;
  }, [expiry]);

  return (
    <WidgetHeader className={className}>
      <Title type="h2" as="h1">
        {title}
      </Title>

      {isLastLook && isQuote && (
        <Button onClick={onGasFreeTradeButtonClick}>
          <StyledIcon name="star" iconSize={0.875} />
          {t("orders.gasFreeTrade")}
        </Button>
      )}

      {!isLastLook && isQuote && expiryTime && (
        <Quote>
          <NewQuoteText>{t("orders.newQuoteIn")}</NewQuoteText>
          {expiryTime && <StyledTimer expiryTime={expiryTime} />}
        </Quote>
      )}
    </WidgetHeader>
  );
};

export default SwapWidgetHeader;
