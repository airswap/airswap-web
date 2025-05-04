import { FC, FormEvent, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/utils";

import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import { getTokenKind } from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
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
  isSelectTokenDisabled?: boolean;
  readOnly?: boolean;
  showMaxButton?: boolean;
  showMaxInfoButton?: boolean;
  showTokenContractLink?: boolean;
  tradeNotAllowed?: boolean;

  baseAmount: string;
  baseAmountSubText?: string;
  baseTokenInfo: AppTokenInfo | null;
  baseAmountError?: AppError;
  maxAmount: string | null;
  side: "buy" | "sell";
  quoteTokenInfo: AppTokenInfo | null;
  quoteAmount: string;
  quoteAmountError?: AppError;

  onBaseAmountChange: (newValue: string) => void;
  onChangeTokenClick?: (baseOrQuote: "base" | "quote") => void;
  onMaxButtonClick: () => void;
  onQuoteAmountChange?: (newValue: string) => void;
  onSwitchTokensButtonClick?: () => void;
  className?: string;
}> = ({
  disabled = false,
  canSetQuoteAmount = false,
  isRequestingBaseAmount = false,
  isRequestingBaseToken = false,
  isRequestingQuoteAmount = false,
  isRequestingQuoteToken = false,
  isSelectTokenDisabled = false,
  readOnly = false,
  showMaxButton = false,
  showMaxInfoButton = false,
  showTokenContractLink = false,
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

  className = "",
}) => {
  const { t } = useTranslation();
  const [showMaxAmountInfo, setShowMaxAmountInfo] = useState(false);

  const isSell = side === "sell";
  const baseTokenKind = baseTokenInfo ? getTokenKind(baseTokenInfo) : undefined;
  const quoteTokenKind = quoteTokenInfo
    ? getTokenKind(quoteTokenInfo)
    : undefined;

  const maxAmountInfoText = useMemo(
    () => getTokenMaxInfoText(baseTokenInfo, maxAmount, t),
    [baseTokenInfo, maxAmount, t]
  );
  const isQuote = !!baseAmount && !!quoteAmount && readOnly;
  const baseAmountErrorText = useErrorTranslation(baseAmountError);
  const quoteAmountErrorText = useErrorTranslation(quoteAmountError);

  const handleTokenAmountChange = (
    e: FormEvent<HTMLInputElement>,
    callback: (value: string) => void
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
    <Container $disabled={disabled} className={className}>
      <TokenSelect
        hasError={!!baseAmountError}
        isQuote={isQuote}
        isRequestingAmount={
          !isSell ? isRequestingQuoteAmount : isRequestingBaseAmount
        }
        isRequestingToken={
          !isSell ? isRequestingQuoteToken : isRequestingBaseToken
        }
        isSelectTokenDisabled={isSelectTokenDisabled || readOnly}
        showMaxButton={showMaxButton}
        showMaxInfoButton={showMaxInfoButton}
        readOnly={readOnly}
        showTokenContractLink={showTokenContractLink}
        amount={isSell ? baseAmount : quoteAmount}
        includeAmountInput={
          isSell || (!!quoteAmount && !isRequestingQuoteAmount)
        }
        label={t("orders.from")}
        selectedToken={isSell ? baseTokenInfo : quoteTokenInfo}
        subText={baseAmountSubText}
        tokenKind={isSell ? baseTokenKind : quoteTokenKind}
        onAmountChange={(e) => handleTokenAmountChange(e, onBaseAmountChange)}
        onChangeTokenClicked={() => {
          onChangeTokenClick?.(isSell ? "base" : "quote");
        }}
        onMaxClicked={handleMaxButtonClick}
        onInfoLabelMouseEnter={handleInfoLabelMouseEnter}
        onInfoLabelMouseLeave={handleInfoLabelMouseLeave}
      />
      <SwitchTokensButton
        disabled={tradeNotAllowed || readOnly || isSelectTokenDisabled}
        onClick={onSwitchTokensButtonClick}
      >
        {getSwitchTokensButtonIcon(tradeNotAllowed, isQuote)}
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
        isSelectTokenDisabled={isSelectTokenDisabled}
        showTokenContractLink={showTokenContractLink}
        amount={isSell ? quoteAmount : baseAmount}
        includeAmountInput={
          !isSell ||
          canSetQuoteAmount ||
          (!!quoteAmount && !isRequestingBaseAmount)
        }
        readOnly={readOnly}
        label={t("orders.to")}
        tokenKind={isSell ? quoteTokenKind : baseTokenKind}
        selectedToken={!isSell ? baseTokenInfo : quoteTokenInfo}
        onAmountChange={(e) =>
          handleTokenAmountChange(e, onQuoteAmountChange || onBaseAmountChange)
        }
        onChangeTokenClicked={() => {
          onChangeTokenClick?.(!isSell ? "base" : "quote");
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
