import { FC, FormEvent, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/typescript";

import stringToSignificantDecimals from "../../helpers/stringToSignificantDecimals";
import TokenSelect from "../TokenSelect/TokenSelect";
import { Container, SwapIconContainer } from "./SwapInputs.styles";
import getSwapInputIcon from "./helpers/getSwapInputIcon";
import getTokenMaxInfoText from "./helpers/getTokenMaxInfoText";
import Tooltip from "./subcomponents/Tooltip/Tooltip";

const floatRegExp = new RegExp("^([0-9])*[.,]?([0-9])*$");

const SwapInputs: FC<{
  disabled?: boolean;
  isRequesting?: boolean;
  readOnly?: boolean;
  showMaxButton?: boolean;
  showMaxInfoButton?: boolean;
  tradeNotAllowed?: boolean;

  baseAmount: string;
  baseTokenInfo: TokenInfo | null;
  maxAmount: string | null;
  side: "buy" | "sell";
  quoteTokenInfo: TokenInfo | null;
  quoteAmount: string;

  onMaxButtonClick: () => void;
  onChangeTokenClick: (baseOrQuote: "base" | "quote") => void;
  onBaseAmountChange: (newValue: string) => void;
}> = ({
  disabled = false,
  isRequesting = false,
  readOnly = false,
  showMaxButton = false,
  showMaxInfoButton = false,
  tradeNotAllowed = false,

  baseAmount,
  baseTokenInfo,
  maxAmount = null,
  quoteAmount,
  quoteTokenInfo,
  side,

  onBaseAmountChange,
  onMaxButtonClick,
  onChangeTokenClick,
}) => {
  const { t } = useTranslation();
  const [showMaxAmountInfo, setShowMaxAmountInfo] = useState(false);

  const isSell = side === "sell";
  const fromAmount = useMemo(
    () => (isSell ? baseAmount : stringToSignificantDecimals(quoteAmount)),
    [isSell, baseAmount, quoteAmount]
  );
  const toAmount = useMemo(
    () => (isSell ? stringToSignificantDecimals(quoteAmount) : baseAmount),
    [isSell, baseAmount, quoteAmount]
  );
  const maxAmountInfoText = useMemo(
    () => getTokenMaxInfoText(baseTokenInfo, maxAmount, t),
    [baseTokenInfo, maxAmount, t]
  );
  const isQuote = !!fromAmount && !!toAmount && readOnly;

  // Note: it will only be possible for the user to change the base amount.
  const handleTokenAmountChange = (e: FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;
    if (value === "" || floatRegExp.test(value)) {
      if (value[value.length - 1] === ",")
        value = value.slice(0, value.length - 1) + ".";
      value = value.replace(/^0+/, "0");
      onBaseAmountChange(value);
    }
  };

  const handleMaxButtonClick = () => {
    onMaxButtonClick();
    setShowMaxAmountInfo(false);
  };

  const handleInfoLabelMouseEnter = () => {
    setShowMaxAmountInfo(true);
  };

  const handleInfoLabelMouseLeave = () => {
    setShowMaxAmountInfo(false);
  };

  return (
    <Container $disabled={disabled}>
      <TokenSelect
        label={t("orders.from")}
        amount={fromAmount}
        onAmountChange={(e) => handleTokenAmountChange(e)}
        onChangeTokenClicked={() => {
          onChangeTokenClick(isSell ? "base" : "quote");
        }}
        onMaxClicked={handleMaxButtonClick}
        onInfoLabelMouseEnter={handleInfoLabelMouseEnter}
        onInfoLabelMouseLeave={handleInfoLabelMouseLeave}
        readOnly={readOnly}
        includeAmountInput={isSell || (!!quoteAmount && !isRequesting)}
        selectedToken={isSell ? baseTokenInfo : quoteTokenInfo}
        isLoading={!isSell && isRequesting}
        isQuote={isQuote}
        showMaxButton={showMaxButton}
        showMaxInfoButton={showMaxInfoButton}
      />
      <SwapIconContainer>{getSwapInputIcon(tradeNotAllowed)}</SwapIconContainer>
      <TokenSelect
        label={t("orders.to")}
        amount={toAmount}
        onAmountChange={(e) => handleTokenAmountChange(e)}
        onChangeTokenClicked={() => {
          onChangeTokenClick(!isSell ? "base" : "quote");
        }}
        readOnly={readOnly}
        includeAmountInput={!isSell || (!!quoteAmount && !isRequesting)}
        selectedToken={!isSell ? baseTokenInfo : quoteTokenInfo}
        isLoading={isSell && isRequesting}
        isQuote={isQuote}
      />
      {!showMaxButton &&
        showMaxInfoButton &&
        showMaxAmountInfo &&
        maxAmountInfoText &&
        !readOnly && <Tooltip>{maxAmountInfoText}</Tooltip>}
    </Container>
  );
};

export default SwapInputs;
