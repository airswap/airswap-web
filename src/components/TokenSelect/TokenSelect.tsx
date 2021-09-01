import { FC, MouseEventHandler, FormEventHandler } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@uniswap/token-lists";

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
} from "./TokenSelect.styles";

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
};

const TokenSelect: FC<TokenSelectProps> = ({
  readOnly,
  includeAmountInput,
  label,
  selectedToken,
  onChangeTokenClicked,
  amount,
  onAmountChange,
  amountDetails,
}) => {
  const { t } = useTranslation(["common"]);
  return (
    <TokenSelectContainer>
      <FlexRow>
        <TokenLogo size="large" tokenInfo={selectedToken} />
        <StyledSelectButton onClick={onChangeTokenClicked} disabled={readOnly}>
          <StyledLabel invisible={readOnly}>{label}</StyledLabel>
          <StyledSelectItem>
            <StyledSelectButtonContent emphasize={readOnly}>
              {selectedToken ? selectedToken.symbol : t("common:select")}
            </StyledSelectButtonContent>
            <StyledDownArrow invisible={readOnly} />
          </StyledSelectItem>
        </StyledSelectButton>
      </FlexRow>
      {includeAmountInput ? (
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
          {amountDetails && <AmountSubtext>{amountDetails}</AmountSubtext>}
        </AmountAndDetailsContainer>
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
