import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { RFQ_EXPIRY_BUFFER_MS } from "../../../../constants/configParams";
import { ProtocolType } from "../../../../features/transactions/transactionsSlice";
import { WidgetHeader } from "../../../../styled-components/WidgetHeader/WidgetHeader";
import Timer from "../../../Timer/Timer";
import { Title } from "../../../Typography/Typography";
import {
  Button,
  NewQuoteText,
  Quote,
  StyledDropdown,
  StyledIcon,
} from "./SwapWidgetHeader.styles";

interface SwapWidgetHeaderProps {
  title: string;
  isQuote: boolean;
  onGasFreeTradeButtonClick: () => void;
  protocol?: ProtocolType;
  expiry?: string;
}

const options = [
  { label: "MINUTE", value: "60" },
  { label: "HOUR", value: "50" },
  { label: "DAY", value: "4" },
  { label: "WEEK", value: "3" },
];

const SwapWidgetHeader: FC<SwapWidgetHeaderProps> = ({
  title,
  isQuote,
  onGasFreeTradeButtonClick,
  protocol,
  expiry,
}) => {
  const { t } = useTranslation();

  const [activeOption, setActiveOption] = useState(options[3]);

  const expiryTime = useMemo(() => {
    return expiry ? parseInt(expiry) - RFQ_EXPIRY_BUFFER_MS / 1000 : undefined;
  }, [expiry]);

  return (
    <WidgetHeader>
      <Title type="h2" as="h1">
        {title}
      </Title>

      <StyledDropdown
        value={activeOption}
        options={options}
        onChange={setActiveOption}
      />

      {protocol === "last-look" && isQuote && (
        <Button onClick={onGasFreeTradeButtonClick}>
          <StyledIcon name="star" iconSize={0.875} />
          {t("orders.gasFreeTrade")}
        </Button>
      )}

      {protocol === "request-for-quote" && isQuote && (
        <Quote>
          <NewQuoteText>{t("orders.newQuoteIn")}</NewQuoteText>
          {expiryTime && <Timer expiryTime={expiryTime} />}
        </Quote>
      )}
    </WidgetHeader>
  );
};

export default SwapWidgetHeader;
