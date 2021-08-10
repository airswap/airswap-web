import { useState, useMemo } from "react";
import { TokenInfo } from "@uniswap/token-lists";
import { IoMdInformationCircle } from "react-icons/io";
import { formatUnits } from "@ethersproject/units";
import { filterTokens } from "./filter";
import { sortTokensBySymbol } from "./sort";
import TokenRow from "./subcomponents/TokenRow";
import TokenImportRow from "./subcomponents/TokenImportRow";
import { BalancesState } from "../../features/balances/balancesSlice";
import { defaultActiveTokens } from "../../features/metadata/metadataApi";
import {
  Container,
  TitleContainer,
  CloseButton,
  SearchInput,
  TokenContainer,
  InactiveTitleContainer,
  InactiveTitle, Legend, LegendItem, LegendDivider,
} from "./TokenSelection.styles";
import { Title } from '../Typography/Typography';
import { useTranslation } from 'react-i18next';

export type TokenSelectionProps = {
  /**
   * Function to close modal
   */
  onClose: () => void;
  /**
   * signerToken contract address (e.g. "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2")
   */
  signerToken: string;
  /**
   * senderToken contract address (e.g. "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2")
   */
  senderToken: string;
  /**
   * useState hook to set signer token
   */
  setSignerToken: (val: string) => void;
  /**
   * useState hook to set sender token
   */
  setSenderToken: (val: string) => void;
  /**
   * Request type incoming to token selection modal; modal handles
   * setSignerToken/setSenderToken based off of this parameter
   */
  tokenSelectType: "signerToken" | "senderToken";
  /**
   * Balances for current tokens in wallet
   */
  balances: BalancesState;
  /**
   * all Token addresses in metadata.
   */
  allTokens: {
    [address: string]: TokenInfo;
  };
  /**
   * All active tokens.
   */
  activeTokens: TokenInfo[];
  /**
   * function to handle adding active tokens (dispatches addActiveToken).
   */
  addActiveToken: (val: string) => void;
  /**
   * function to handle removing active tokens (dispatches removeActiveToken).
   */
  removeActiveToken: (val: string) => void;
  /**
   * currently connected chain id
   */
  chainId: number;
};

const TokenSelection = ({
  onClose,
  signerToken,
  senderToken,
  setSignerToken,
  setSenderToken,
  tokenSelectType,
  balances,
  allTokens,
  activeTokens = [],
  addActiveToken,
  removeActiveToken,
  chainId,
}: TokenSelectionProps) => {
  const [tokenQuery, setTokenQuery] = useState<string>("");
  const { t } = useTranslation(["common", "wallet", "balances"]);

  // handle user clicking row
  const handleClick = (address: string) => {
    if (tokenSelectType === "senderToken") {
      // swap the token addresses
      if (address === signerToken) setSignerToken(senderToken);
      setSenderToken(address);
    } else {
      if (address === senderToken) setSenderToken(signerToken);
      setSignerToken(address);
    }
    onClose();
  };

  // sort tokens based on symbol
  const sortedTokens: TokenInfo[] = useMemo(() => {
    return sortTokensBySymbol(activeTokens);
  }, [activeTokens]);

  // filter token
  const filteredTokens: TokenInfo[] = useMemo(() => {
    return filterTokens(Object.values(sortedTokens), tokenQuery);
  }, [sortedTokens, tokenQuery]);

  // sort inactive tokens based on symbol
  const sortedInactiveTokens: TokenInfo[] = useMemo(() => {
    return sortTokensBySymbol(
      Object.values(allTokens).filter((el) => {
        return !activeTokens.includes(el);
      })
    );
  }, [allTokens, activeTokens]);

  // only take the top 10 tokens
  const inactiveTokens: TokenInfo[] = useMemo(() => {
    return filterTokens(Object.values(sortedInactiveTokens), tokenQuery!).slice(
      0,
      10
    );
  }, [sortedInactiveTokens, tokenQuery]);

  return (
    <Container>
      <TitleContainer>
        <Title type="h2">{t('common:swap')}</Title>
        <CloseButton icon="chevron-down" iconSize={1} onClick={onClose} />
      </TitleContainer>
      <SearchInput
        hideLabel
        id="tokenQuery"
        type="text"
        label="Search name or address"
        value={tokenQuery}
        placeholder="Search name or paste address"
        onChange={(e) => {
          setTokenQuery(e.currentTarget.value);
        }}
      />

      <Legend>
        <LegendItem>{t('common:token')}</LegendItem>
        <LegendDivider />
        <LegendItem>{t('balances:balance')}</LegendItem>
      </Legend>

      {filteredTokens && filteredTokens.length > 0 && (
        <TokenContainer listLength={filteredTokens.length}>
          {filteredTokens.map((token) => (
            <TokenRow
              token={token}
              balance={formatUnits(
                balances.values[token.address] || 0,
                token.decimals
              )}
              setToken={handleClick}
              disabled={
                tokenSelectType === "senderToken"
                  ? token.address === senderToken
                  : token.address === signerToken
              } // shouldn't be able to select same duplicate token
              removeActiveToken={removeActiveToken}
              defaultToken={defaultActiveTokens[chainId!].includes(
                token.address
              )}
              key={token.address}
            />
          ))}
        </TokenContainer>
      )}
      {chainId === 1 &&
        tokenQuery &&
        filteredTokens.length < 5 &&
        inactiveTokens &&
        inactiveTokens.length > 0 && (
          <>
            <InactiveTitleContainer>
              <InactiveTitle>
                Expanded results from inactive Token Lists
              </InactiveTitle>
              <IoMdInformationCircle />
            </InactiveTitleContainer>
            <TokenContainer listLength={inactiveTokens.length}>
              {inactiveTokens.map((token) => (
                <TokenImportRow
                  token={token}
                  onClick={() => {
                    addActiveToken(token.address);
                    setTokenQuery("");
                  }}
                  key={`${token.address}`}
                />
              ))}
            </TokenContainer>
          </>
        )}
    </Container>
  );
};

export default TokenSelection;
