import { FC, MouseEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import stringToSignificantDecimals from "../../../../helpers/stringToSignificantDecimals";
import TokenSelect from "../../../TokenSelect/TokenSelect";
import getSwapInputIcon from "../../helpers/getSwapInputIcon";
import { Container, SwapIconContainer } from "./SwapInputs.styles";

const floatRegExp = new RegExp("^([0-9])*[.,]?([0-9])*$");

const SwapInputs: FC<{
  tradeNotAllowed: boolean;
  baseAmount: string;
  baseTokenInfo: TokenInfo | null;
  quoteTokenInfo: TokenInfo | null;
  quoteAmount: string;
  side: "buy" | "sell";
  disabled: boolean;
  readOnly: boolean;
  isRequesting: boolean;
  onMaxButtonClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onChangeTokenClick: (baseOrQuote: "base" | "quote") => void;
  onBaseAmountChange: (newValue: string) => void;
  showMaxButton: boolean;
}> = ({
  tradeNotAllowed,
  baseAmount,
  quoteAmount,
  side,
  disabled,
  readOnly,
  onMaxButtonClick,
  onChangeTokenClick,
  isRequesting,
  baseTokenInfo,
  quoteTokenInfo,
  onBaseAmountChange,
  showMaxButton = false,
}) => {
  let fromAmount: string, toAmount: string;
  const isSell = side === "sell";
  if (isSell) {
    fromAmount = baseAmount;
    toAmount = stringToSignificantDecimals(quoteAmount);
  } else {
    fromAmount = stringToSignificantDecimals(quoteAmount);
    toAmount = baseAmount;
  }

  const isQuote = !!fromAmount && !!toAmount && readOnly;
  const { t } = useTranslation(["orders"]);

  // Note: it will only be possible for the user to change the base amount.
  const handleTokenAmountChange = (e: FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;
    if (value === "" || floatRegExp.test(value)) {
      if (value[value.length - 1] === ",")
        value = value.slice(0, value.length - 1) + ".";
      onBaseAmountChange(value);
    }
  };

  return (
    <Container $disabled={disabled}>
      <TokenSelect
        label={t("orders:from")}
        amount={fromAmount}
        onAmountChange={(e) => handleTokenAmountChange(e)}
        onChangeTokenClicked={() => {
          onChangeTokenClick(isSell ? "base" : "quote");
        }}
        onMaxClicked={onMaxButtonClick}
        readOnly={readOnly}
        includeAmountInput={isSell || (!!quoteAmount && !isRequesting)}
        selectedToken={isSell ? baseTokenInfo : quoteTokenInfo}
        isLoading={!isSell && isRequesting}
        isQuote={isQuote}
        showMaxButton={showMaxButton}
      />
      <SwapIconContainer>{getSwapInputIcon(tradeNotAllowed)}</SwapIconContainer>
      <TokenSelect
        label={t("orders:to")}
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
    </Container>
  );
};

export default SwapInputs;
