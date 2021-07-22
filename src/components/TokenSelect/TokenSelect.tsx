import { useEffect, useState } from "react";
import { TokenInfo } from "@uniswap/token-lists";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import TextInput from '../TextInput/TextInput';
import { StyledTokenSelect, TokenSelectorButton, TokenSelectorLoader } from './TokenSelect.styles';

type TokenSelectProps = {
  withAmount: boolean;
  quoteAmount?: string | null;
  label: string;
  className?: string;
  amount?: string;
  token?: string;
  tokens: TokenInfo[];
  hasError?: boolean;
  onAmountChange?: React.FormEventHandler<HTMLInputElement>;
  onTokenChange?: () => void;
};

const TokenSelect = ({
  withAmount,
  quoteAmount,
  label,
  className,
  tokens,
  amount,
  onAmountChange,
  token,
  onTokenChange,
  hasError = false,
}: TokenSelectProps) => {
  const { t } = useTranslation(["common", "orders"]);
  const { chainId } = useWeb3React<Web3Provider>();
  const [
    isDefaultOptionDisabled,
    setIsDefaultOptionDisabled,
  ] = useState(false);
  const [tokenSelectorText, setTokenSelectorText] = useState("");

  useEffect(() => {
    setIsDefaultOptionDisabled(false);
  }, [chainId]);

  useEffect(() => {
    const match = tokens.find((t)=> t.address === token)?.symbol;
    const text = match || isDefaultOptionDisabled ? match : `${t("common:select")}…`;

    setTokenSelectorText(text || "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, token, isDefaultOptionDisabled]);

  return (
    <StyledTokenSelect
      className={className}
      hasToken={!!token}
    >
      {withAmount ? (
        <TextInput
          label={label}
          inputMode="decimal"
          autoComplete="off"
          pattern="^[0-9]*[.,]?[0-9]*$"
          minLength={1}
          maxLength={79}
          spellCheck={false}
          value={amount}
          hasError={hasError}
          onChange={onAmountChange}
          placeholder="0.0"
        />
      ) : (
        <TextInput
          disabled
          label={label}
          autoComplete="off"
          spellCheck={false}
          value={!token ? t("orders:chooseToken") : quoteAmount || ''}
        />
      )}

      {tokens ? (
        <TokenSelectorButton
          iconSize={0.675}
          icon="arrow-right"
          text={tokenSelectorText}
          onClick={() => onTokenChange && onTokenChange()}
        />
      ) : (
        <TokenSelectorLoader />
      )}
    </StyledTokenSelect>
  );
};

export default TokenSelect;
