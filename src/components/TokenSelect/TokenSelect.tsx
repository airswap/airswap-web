import {
  FC,
  MouseEventHandler,
  FormEventHandler,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/utils";

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
  TokenAccountButton,
  TokenSelectOverflowContainer,
  StyledTokenSelectBackground,
} from "./TokenSelect.styles";
import { getTokenText } from "./helpers";

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
  showTokenContractLink?: boolean;
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
  showTokenContractLink = false,
}) => {
  const { t } = useTranslation();
  const [isTokenFocused, setTokenFocused] = useState(false);
  const [isAmountFocused, setIsAmountFocused] = useState(false);

  const tokenText = useMemo(() => {
    return getTokenText(selectedToken, readOnly);
  }, [selectedToken, readOnly]);

  const handleAmountFocus = () => setIsAmountFocused(true);
  const handleAmountBlur = () => setIsAmountFocused(false);
  const handleTokenFocus = () => setTokenFocused(true);
  const handleTokenBlur = () => setTokenFocused(false);

  return (
    <TokenSelectContainer
      isQuote={isQuote}
      isLoading={isRequestingAmount}
      isAmountFocused={isAmountFocused}
      isTokenFocused={isTokenFocused}
      showTokenContractLink={showTokenContractLink}
    >
      {!readOnly && <StyledTokenSelectBackground />}
      <TokenSelectOverflowContainer>
        {selectedToken && showTokenContractLink && (
          <TokenAccountButton
            chainId={selectedToken.chainId}
            address={selectedToken.address}
            onBlur={handleTokenBlur}
            onFocus={handleTokenFocus}
            onMouseEnter={handleTokenFocus}
            onMouseLeave={handleTokenBlur}
          />
        )}
        {!isRequestingToken ? (
          <ContainingButton
            disabled={readOnly}
            onClick={onChangeTokenClicked}
            onBlur={handleTokenBlur}
            onFocus={handleTokenFocus}
            onMouseEnter={handleTokenFocus}
            onMouseLeave={handleTokenBlur}
          >
            <TokenLogoLeft logoURI={selectedToken?.logoURI} />
            <StyledSelector>
              <StyledLabel>{label}</StyledLabel>
              <StyledSelectItem>
                <StyledSelectButtonContent>
                  {tokenText}
                </StyledSelectButtonContent>
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
                onBlur={handleAmountBlur}
                onChange={onAmountChange}
                onFocus={handleAmountFocus}
                onMouseEnter={handleAmountFocus}
                onMouseLeave={handleAmountBlur}
                placeholder="0.00"
              />
              {subText && <SubText>{subText}</SubText>}
            </AmountAndDetailsContainer>
            {onMaxClicked && showMaxButton && !readOnly && (
              <MaxButton
                onClick={onMaxClicked}
                onBlur={handleAmountBlur}
                onFocus={handleAmountFocus}
                onMouseEnter={handleAmountFocus}
                onMouseLeave={handleAmountBlur}
              >
                {t("common.max")}
              </MaxButton>
            )}
            {showMaxInfoButton && !showMaxButton && !readOnly && (
              <InfoLabel
                onMouseOver={onInfoLabelMouseEnter}
                onFocus={onInfoLabelMouseEnter}
                onMouseOut={onInfoLabelMouseLeave}
                onBlur={onInfoLabelMouseLeave}
              >
                i
              </InfoLabel>
            )}
            <TokenLogoRight logoURI={selectedToken?.logoURI} />
          </InputAndMaxButtonWrapper>
        ) : (
          <PlaceholderContainer>
            <PlaceHolderBar />
          </PlaceholderContainer>
        )}
      </TokenSelectOverflowContainer>
    </TokenSelectContainer>
  );
};

export default TokenSelect;
