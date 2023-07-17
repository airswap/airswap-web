import { FC, FormEvent, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import { AppError } from "../../errors/appError";
import TokenSelect from "../TokenSelect/TokenSelect";
import {
  BaseAmountErrorTooltip,
  Container,
  MaxAmountInfoTooltip,
  QuoteAmountErrorTooltip,
  SwitchTokensButton,
} from "./SwapInputs.styles";
import getSwitchTokensButtonIcon from "./helpers/getSwapInputIcon";
import getTokenMaxInfoText from "./helpers/getTokenMaxInfoText";
import useErrorTranslation from "./hooks/useErrorTranslation";

const floatRegExp = new RegExp("^([0-9])*[.,]?([0-9])*$");

const SwapInputs: FC<{
  disabled?: boolean;
  canSetQuoteAmount?: boolean;
  isRequestingBaseAmount?: boolean;
  isRequestingBaseToken?: boolean;
  isRequestingQuoteAmount?: boolean;
  isRequestingQuoteToken?: boolean;
  readOnly?: boolean;
  showMaxButton?: boolean;
  showMaxInfoButton?: boolean;
  tradeNotAllowed?: boolean;

  baseAmount: string;
  baseAmountSubText?: string;
  baseTokenInfo: TokenInfo | null;
  baseAmountError?: AppError;
  maxAmount: string | null;
  side: "buy" | "sell";
  quoteTokenInfo: TokenInfo | null;
  quoteAmount: string;
  quoteAmountError?: AppError;

  onBaseAmountChange: (newValue: string) => void;
  onChangeTokenClick: (baseOrQuote: "base" | "quote") => void;
  onMaxButtonClick: () => void;
  onQuoteAmountChange?: (newValue: string) => void;
  onSwitchTokensButtonClick?: () => void;
}> = ({
  disabled = false,
  canSetQuoteAmount = false,
  isRequestingBaseAmount = false,
  isRequestingBaseToken = false,
  isRequestingQuoteAmount = false,
  isRequestingQuoteToken = false,
  readOnly = false,
  showMaxButton = false,
  showMaxInfoButton = false,
  tradeNotAllowed = false,

  baseAmount,
  baseAmountSubText,
  baseTokenInfo,
  baseAmountError,
  maxAmount = null,
  quoteAmount,
  quoteTokenInfo,
  quoteAmountError,
  side,

  onBaseAmountChange,
  onChangeTokenClick,
  onMaxButtonClick,
  onQuoteAmountChange,
  onSwitchTokensButtonClick,
}) => {
  const { t } = useTranslation();
  const [showMaxAmountInfo, setShowMaxAmountInfo] = useState(false);

  const isSell = side === "sell";

  const maxAmountInfoText = useMemo(
    () => getTokenMaxInfoText(baseTokenInfo, maxAmount, t),
    [baseTokenInfo, maxAmount, t]
  );
  const isQuote = !!baseAmount && !!quoteAmount && readOnly;
  const baseAmountErrorText = useErrorTranslation(baseAmountError);
  const quoteAmountErrorText = useErrorTranslation(quoteAmountError);

  const handleTokenAmountChange = (
    e: FormEvent<HTMLInputElement>,
    callback: Function
  ) => {
    let value = e.currentTarget.value;
    if (value === "" || floatRegExp.test(value)) {
      if (value[value.length - 1] === ",")
        value = value.slice(0, value.length - 1) + ".";
      value = value.replace(/^0+/, "0");
      callback(value);
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
        hasError={!!baseAmountError}
        isQuote={isQuote}
        isRequestingAmount={
          !isSell ? isRequestingQuoteAmount : isRequestingBaseAmount
        }
        isRequestingToken={
          !isSell ? isRequestingQuoteToken : isRequestingBaseToken
        }
        showMaxButton={showMaxButton}
        showMaxInfoButton={showMaxInfoButton}
        readOnly={readOnly}
        amount={isSell ? baseAmount : quoteAmount}
        includeAmountInput={
          isSell || (!!quoteAmount && !isRequestingQuoteAmount)
        }
        label={t("orders.from")}
        selectedToken={isSell ? baseTokenInfo : quoteTokenInfo}
        subText={baseAmountSubText}
        onAmountChange={(e) => handleTokenAmountChange(e, onBaseAmountChange)}
        onChangeTokenClicked={() => {
          onChangeTokenClick(isSell ? "base" : "quote");
        }}
        onMaxClicked={handleMaxButtonClick}
        onInfoLabelMouseEnter={handleInfoLabelMouseEnter}
        onInfoLabelMouseLeave={handleInfoLabelMouseLeave}
      />
      <SwitchTokensButton
        disabled={tradeNotAllowed || readOnly}
        onClick={onSwitchTokensButtonClick}
      >
        {getSwitchTokensButtonIcon(tradeNotAllowed)}
      </SwitchTokensButton>
      <TokenSelect
        hasError={!!quoteAmountError}
        isQuote={isQuote}
        isRequestingAmount={
          isSell ? isRequestingQuoteAmount : isRequestingBaseAmount
        }
        isRequestingToken={
          isSell ? isRequestingQuoteToken : isRequestingBaseToken
        }
        amount={isSell ? quoteAmount : baseAmount}
        includeAmountInput={
          !isSell ||
          canSetQuoteAmount ||
          (!!quoteAmount && !isRequestingBaseAmount)
        }
        readOnly={readOnly}
        label={t("orders.to")}
        selectedToken={!isSell ? baseTokenInfo : quoteTokenInfo}
        onAmountChange={(e) =>
          handleTokenAmountChange(e, onQuoteAmountChange || onBaseAmountChange)
        }
        onChangeTokenClicked={() => {
          onChangeTokenClick(!isSell ? "base" : "quote");
        }}
      />
      {!showMaxButton &&
        showMaxInfoButton &&
        showMaxAmountInfo &&
        maxAmountInfoText &&
        !readOnly && (
          <MaxAmountInfoTooltip>{maxAmountInfoText}</MaxAmountInfoTooltip>
        )}

      {baseAmountErrorText && (
        <BaseAmountErrorTooltip>{baseAmountErrorText}</BaseAmountErrorTooltip>
      )}

      {quoteAmountErrorText && (
        <QuoteAmountErrorTooltip>
          {quoteAmountErrorText}
        </QuoteAmountErrorTooltip>
      )}
    </Container>
  );
};

export default SwapInputs;
