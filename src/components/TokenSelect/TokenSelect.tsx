import { FC, MouseEventHandler, FormEventHandler, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import {
  AmountInput,
  AmountAndDetailsContainer,
  ContainingButton,
  TokenSelectContainer,
  StyledSelectItem,
  StyledSelector,
  PlaceHolderBar,
  PlaceholderContainer,
  StyledLabel,
  StyledDownArrow,
  StyledSelectButtonContent,
  TokenLogoLeft,
  TokenLogoRight,
  MaxButton,
  InputAndMaxButtonWrapper,
  InfoLabel,
  SubText,
} from "./TokenSelect.styles";
import { getTokenText } from "./helpers";
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
   * Called when user's mouse enters 'info' label.
   */
  onInfoLabelMouseEnter?: () => void;
  /**
   * Called when user's mouse leaves 'info' label.
   */
  onInfoLabelMouseLeave?: () => void;
  /**
   * Currently selected amount. Not used if `includeAmountInput` is false.
   */
  amount?: string | null;
  /**
   * Called when the amount is changed. Input change event is passed.
   */
  onAmountChange?: FormEventHandler<HTMLInputElement>;
  /**
   * Used for showing requesting amount state
   */
  isRequestingAmount?: boolean;
  /**
   * Used for showing requesting token state
   */
  isRequestingToken?: boolean;
  /**
   * Show max button
   */
  showMaxButton?: boolean;
  /**
   * Show max info button
   */
  showMaxInfoButton?: boolean;
  /**
   * Used for showing quote style
   */
  isQuote?: boolean;
  hasError?: boolean;
  subText?: string;
};

const TokenSelect: FC<TokenSelectProps> = ({
  readOnly,
  includeAmountInput,
  label,
  selectedToken,
  subText,
  onChangeTokenClicked,
  onMaxClicked,
  onInfoLabelMouseEnter,
  onInfoLabelMouseLeave,
  amount,
  onAmountChange,
  isRequestingAmount = false,
  isRequestingToken = false,
  isQuote = false,
  hasError = false,
  showMaxButton = false,
  showMaxInfoButton = false,
}) => {
  const { t } = useTranslation();

  const tokenText = useMemo(() => {
    return getTokenText(selectedToken, readOnly);
  }, [selectedToken, readOnly]);

  return (
    <TokenSelectContainer $isQuote={isQuote} $isLoading={isRequestingAmount}>
      {!isRequestingToken ? (
        <ContainingButton onClick={onChangeTokenClicked} disabled={readOnly}>
          <TokenLogoLeft logoURI={selectedToken?.logoURI} size="large" />
          <StyledSelector>
            <StyledLabel>{label}</StyledLabel>
            <StyledSelectItem>
              <StyledSelectButtonContent>{tokenText}</StyledSelectButtonContent>
              <StyledDownArrow $invisible={readOnly} />
            </StyledSelectItem>
          </StyledSelector>
        </ContainingButton>
      ) : (
        <PlaceholderContainer>
          <StyledLabel>{label}</StyledLabel>
          <PlaceHolderBar />
        </PlaceholderContainer>
      )}
      <TokenSelectFocusBorder position="left" />
      {includeAmountInput && selectedToken && !isRequestingAmount ? (
        <InputAndMaxButtonWrapper>
          <AmountAndDetailsContainer>
            <AmountInput
              // @ts-ignore
              inputMode="decimal"
              hasSubtext={!!subText}
              tabIndex={readOnly ? -1 : 0}
              autoComplete="off"
              pattern="^[0-9]*[.,]?[0-9]*$"
              minLength={1}
              maxLength={79}
              spellCheck={false}
              value={amount}
              disabled={readOnly}
              onChange={onAmountChange}
              placeholder="0.00"
            />
            {!readOnly && (
              <TokenSelectFocusBorder position="right" hasError={hasError} />
            )}
            {subText && <SubText>{subText}</SubText>}
          </AmountAndDetailsContainer>
          {onMaxClicked && showMaxButton && !readOnly && (
            <MaxButton onClick={onMaxClicked}>{t("common.max")}</MaxButton>
          )}
          {showMaxInfoButton && !showMaxButton && !readOnly && (
            <InfoLabel
              onMouseOver={onInfoLabelMouseEnter}
              onMouseOut={onInfoLabelMouseLeave}
            >
              i
            </InfoLabel>
          )}
          <TokenLogoRight logoURI={selectedToken?.logoURI} size="medium" />
        </InputAndMaxButtonWrapper>
      ) : (
        <PlaceholderContainer>
          <PlaceHolderBar />
        </PlaceholderContainer>
      )}
    </TokenSelectContainer>
  );
};

export default TokenSelect;
