import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { formatUnits } from "@ethersproject/units";
import { TokenInfo } from "@uniswap/token-lists";

import { BalancesState } from "../../features/balances/balancesSlice";
import useWindowSize from "../../helpers/useWindowSize";
import {
  Container,
  TitleContainer,
  CloseButton,
  SearchInput,
  TokenContainer,
  Legend,
  LegendItem,
  LegendDivider,
  ScrollContainer,
  ContentContainer,
  StyledTitle,
} from "./TokenSelection.styles";
import { filterTokens } from "./filter";
import { sortTokenByExactMatch, sortTokensBySymbolAndBalance } from "./sort";
import InactiveTokensList from "./subcomponents/InactiveTokensList/InactiveTokensList";
import TokenButton from "./subcomponents/TokenButton/TokenButton";

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
  allTokens: TokenInfo[];
  /**
   * All active tokens.
   */
  activeTokens: TokenInfo[];
  /**
   * Supported tokens according to registry
   */
  supportedTokenAddresses: string[];
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
  /**
   * Hide or show the component
   */
  isHidden?: boolean;
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
  supportedTokenAddresses,
  addActiveToken,
  removeActiveToken,
  chainId,
  isHidden = false,
}: TokenSelectionProps) => {
  const { width, height } = useWindowSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

  const [tokenQuery, setTokenQuery] = useState<string>("");
  const { t } = useTranslation([
    "common",
    "wallet",
    "orders",
    "balances",
    "orders",
  ]);

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
    return sortTokensBySymbolAndBalance(activeTokens, balances);
  }, [activeTokens, balances]);

  // filter token
  const filteredTokens: TokenInfo[] = useMemo(() => {
    return filterTokens(Object.values(sortedTokens), tokenQuery);
  }, [sortedTokens, tokenQuery]);

  const sortedFilteredTokens: TokenInfo[] = useMemo(() => {
    return sortTokenByExactMatch(filteredTokens, tokenQuery);
  }, [filteredTokens, tokenQuery]);

  useEffect(() => {
    if (containerRef.current && scrollContainerRef.current) {
      const { offsetTop, scrollHeight } = scrollContainerRef.current;
      setOverflow(scrollHeight + offsetTop > containerRef.current.offsetHeight);
    }
  }, [
    containerRef,
    scrollContainerRef,
    activeTokens,
    sortedTokens,
    allTokens,
    tokenQuery,
    width,
    height,
  ]);

  return (
    <Container ref={containerRef} overflow={overflow} isHidden={isHidden}>
      <TitleContainer>
        <StyledTitle type="h2">{t("common:swap")}</StyledTitle>
        <CloseButton icon="chevron-down" iconSize={1} onClick={onClose} />
      </TitleContainer>
      <ContentContainer>
        <SearchInput
          hideLabel
          id="tokenQuery"
          type="text"
          label={t("orders:searchByNameOrAddress")}
          value={tokenQuery}
          placeholder={t("orders:searchByNameOrAddress")}
          onChange={(e) => {
            setTokenQuery(e.currentTarget.value);
          }}
        />

        <ScrollContainer ref={scrollContainerRef}>
          <Legend>
            <LegendItem>{t("common:token")}</LegendItem>
            <LegendDivider />
            <LegendItem>{t("balances:balance")}</LegendItem>
          </Legend>

          {sortedFilteredTokens && sortedFilteredTokens.length > 0 && (
            <TokenContainer>
              {sortedFilteredTokens.map((token) => (
                <TokenButton
                  token={token}
                  balance={formatUnits(
                    balances.values[token.address] || 0,
                    token.decimals
                  )}
                  setToken={handleClick}
                  removeActiveToken={removeActiveToken}
                  key={token.address}
                />
              ))}
            </TokenContainer>
          )}
          {tokenQuery && sortedFilteredTokens.length < 5 && (
            <InactiveTokensList
              tokenQuery={tokenQuery}
              activeTokens={activeTokens}
              allTokens={allTokens}
              supportedTokenAddresses={supportedTokenAddresses}
              onTokenClick={(tokenAddress) => {
                addActiveToken(tokenAddress);
                setTokenQuery("");
              }}
            />
          )}
        </ScrollContainer>
      </ContentContainer>
    </Container>
  );
};

export default TokenSelection;
