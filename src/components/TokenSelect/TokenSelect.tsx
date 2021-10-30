import { FC, MouseEventHandler, FormEventHandler } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import TokenLogo from "../TokenLogo/TokenLogo";
import {
  AmountInput,
  AmountAndDetailsContainer,
  AmountSubtext,
  FlexRow,
  TokenSelectContainer,
  StyledSelectItem,
  StyledSelectButton,
  PlaceholderContainer,
  PlaceholderTop,
  PlaceholderBottom,
  StyledLabel,
  StyledDownArrow,
  StyledSelectButtonContent,
  InputAndMaxButtonWrapper,
  MaxButton,
} from "./TokenSelect.styles";
import TokenSelectFocusBorder from "./subcomponents/TokenSelectFocusBorder/TokenSelectFocusBorder";

export type TokenSelectProps = {
  /**
   * Whether or not the token selector is read only, e.g. when used to display
   * a quote.
   */
  readOnly: boolean;
  /**
   * Whether or not to display an amount input with the token select, or to
   * display a placeholder, e.g. when used to select received token where amount
   * isn't known yet.
   */
  includeAmountInput: boolean;
  /**
   * Label - note that this is not shown if the field is readOnly.
   */
  label: string;
  /**
   * Metadata for currently selected token
   */
  selectedToken: TokenInfo | null;
  /**
   * Called when the user has clicked on the token dropdown to change token
   */
  onChangeTokenClicked: MouseEventHandler<HTMLButtonElement>;
  /**
   * Called when user clicks the 'use max' button. Presence of this prop is used
   * to imply presence of use max button in DOM.
   */
  onMaxClicked?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Currently selected amount. Not used if `includeAmountInput` is false.
   */
  amount?: string | null;
  /**
   * Called when the amount is changed. Input change event is passed.
   */
  onAmountChange?: FormEventHandler<HTMLInputElement>;
  /**
   * Text to include beneath the amount. Currently used for fee information.
   */
  amountDetails?: string;
  /**
   * Used for showing loading state
   */
  isLoading?: boolean;
  /**
   * Show max button
   */
  showMaxButton?: boolean;
};

const TokenSelect: FC<TokenSelectProps> = ({
  readOnly,
  includeAmountInput,
  label,
  selectedToken,
  onChangeTokenClicked,
  onMaxClicked,
  amount,
  onAmountChange,
  amountDetails,
  isLoading = false,
  showMaxButton = false,
}) => {
  const { t } = useTranslation(["common"]);
  return (
    <TokenSelectContainer isLoading={isLoading}>
      <FlexRow>
        <TokenLogo size="large" tokenInfo={selectedToken} />
        <StyledSelectButton onClick={onChangeTokenClicked} disabled={readOnly}>
          <StyledLabel $invisible={readOnly}>{label}</StyledLabel>
          <StyledSelectItem>
            <StyledSelectButtonContent $emphasize={readOnly}>
              {selectedToken ? selectedToken.symbol : t("common:select")}
            </StyledSelectButtonContent>
            <StyledDownArrow $invisible={readOnly} />
          </StyledSelectItem>
        </StyledSelectButton>
        <TokenSelectFocusBorder position="left" />
      </FlexRow>
      {includeAmountInput ? (
        <InputAndMaxButtonWrapper>
          <AmountAndDetailsContainer>
            <AmountInput
              // @ts-ignore
              inputMode="decimal"
              autoComplete="off"
              pattern="^[0-9]*[.,]?[0-9]*$"
              minLength={1}
              maxLength={79}
              spellCheck={false}
              value={amount}
              disabled={readOnly}
              onChange={onAmountChange}
              placeholder="0.00"
              hasSubtext={!!amountDetails}
            />
            <TokenSelectFocusBorder position="right" />
            {amountDetails && <AmountSubtext>{amountDetails}</AmountSubtext>}
          </AmountAndDetailsContainer>
          {onMaxClicked && showMaxButton && !readOnly && (
            <MaxButton onClick={onMaxClicked}>{t("common:max")}</MaxButton>
          )}
        </InputAndMaxButtonWrapper>
      ) : (
        <PlaceholderContainer>
          <PlaceholderTop />
          <PlaceholderBottom />
        </PlaceholderContainer>
      )}
    </TokenSelectContainer>
  );
};

export default TokenSelect;
