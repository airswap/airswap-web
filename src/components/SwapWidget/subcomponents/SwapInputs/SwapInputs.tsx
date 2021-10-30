import { FC, MouseEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { MdBlock, MdArrowDownward } from "react-icons/md";

import { TokenInfo } from "@airswap/types";

import styled from "styled-components/macro";

import stringToSignificantDecimals from "../../../../helpers/stringToSignificantDecimals";
import TokenSelect from "../../../TokenSelect/TokenSelect";

export const SwapIconContainer = styled.div`
  position: absolute;
  right: 14.125rem;
  top: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  background-color: ${(props) => props.theme.colors.black};
  font-size: 1.25rem;
  z-index: 1;
`;

const floatRegExp = new RegExp("^([0-9])*[.,]?([0-9])*$");

const SwapInputs: FC<{
  tradeNotAllowed: boolean;
  baseAmount: string;
  baseTokenInfo: TokenInfo | null;
  quoteTokenInfo: TokenInfo | null;
  quoteAmount: string;
  side: "buy" | "sell";
  readOnly: boolean;
  isRequesting: boolean;
  noFee: boolean;
  onMaxButtonClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onChangeTokenClick: (baseOrQuote: "base" | "quote") => void;
  onBaseAmountChange: (newValue: string) => void;
  showMaxButton: boolean;
}> = ({
  tradeNotAllowed,
  baseAmount,
  quoteAmount,
  side,
  readOnly,
  onMaxButtonClick,
  onChangeTokenClick,
  isRequesting,
  noFee,
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
    <>
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
        amountDetails={
          !isSell && !isRequesting && quoteAmount
            ? t("orders:afterFee", { fee: "0.07%" })
            : ""
        }
        selectedToken={isSell ? baseTokenInfo : quoteTokenInfo}
        isLoading={!isSell && isRequesting}
        showMaxButton={showMaxButton}
      />
      <SwapIconContainer>
        {tradeNotAllowed ? <MdBlock /> : <MdArrowDownward />}
      </SwapIconContainer>
      <TokenSelect
        label={t("orders:to")}
        amount={toAmount}
        onAmountChange={(e) => handleTokenAmountChange(e)}
        onChangeTokenClicked={() => {
          onChangeTokenClick(!isSell ? "base" : "quote");
        }}
        readOnly={readOnly}
        includeAmountInput={!isSell || (!!quoteAmount && !isRequesting)}
        amountDetails={
          isSell && !isRequesting && quoteAmount && !noFee
            ? t("orders:afterFee", { fee: "0.07%" })
            : ""
        }
        selectedToken={!isSell ? baseTokenInfo : quoteTokenInfo}
        isLoading={isSell && isRequesting}
      />
    </>
  );
};

export default SwapInputs;
