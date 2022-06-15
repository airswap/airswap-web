import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/typescript";
import { formatUnits } from "@ethersproject/units";

import nativeCurrency from "../../constants/nativeCurrency";
import { BalancesState } from "../../features/balances/balancesSlice";
import useWindowSize from "../../hooks/useWindowSize";
import { OverlayActionButton } from "../Overlay/Overlay.styles";
import { InfoHeading } from "../Typography/Typography";
import {
  Container,
  SearchInput,
  TokenContainer,
  Legend,
  LegendItem,
  LegendDivider,
  StyledScrollContainer,
  ContentContainer,
  NoResultsContainer,
  SizingContainer,
} from "./TokenList.styles";
import { filterTokens } from "./filter";
import { sortTokenByExactMatch, sortTokensBySymbolAndBalance } from "./sort";
import InactiveTokensList from "./subcomponents/InactiveTokensList/InactiveTokensList";
import TokenButton from "./subcomponents/TokenButton/TokenButton";

export type TokenListProps = {
  /**
   * ID of currently connected chain
   */
  chainId: number;
  /**
   * Called when a token has been seleced.
   */
  onSelectToken: (val: string) => void;
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
};

const TokenList = ({
  chainId,
  onSelectToken,
  balances,
  allTokens,
  activeTokens = [],
  supportedTokenAddresses,
  addActiveToken,
  removeActiveToken,
}: TokenListProps) => {
  const { width, height } = useWindowSize();
  const sizingContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [tokenQuery, setTokenQuery] = useState<string>("");
  const { t } = useTranslation();

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

  // sort inactive tokens based on symbol
  const sortedInactiveTokens: TokenInfo[] = useMemo(() => {
    return sortTokenByExactMatch(
      allTokens.filter((el) => {
        return !activeTokens.includes(el);
      }),
      tokenQuery
    );
  }, [allTokens, activeTokens, tokenQuery]);

  // only take the top 10 tokens
  const inactiveTokens: TokenInfo[] = useMemo(() => {
    const tokens = filterTokens(Object.values(sortedInactiveTokens), tokenQuery!);
    return tokens.length >= 100 ? tokens.slice(0, 100) : tokens;
  }, [sortedInactiveTokens, tokenQuery]);

  useEffect(() => {
    if (
      sizingContainerRef.current &&
      scrollContainerRef.current &&
      buttonRef.current
    ) {
      const { offsetTop, scrollHeight } = scrollContainerRef.current;
      const { clientHeight: buttonHeight } = buttonRef.current;

      setOverflow(
        scrollHeight + offsetTop + buttonHeight >
          sizingContainerRef.current.offsetHeight
      );
    }
  }, [
    sizingContainerRef,
    scrollContainerRef,
    activeTokens,
    sortedTokens,
    allTokens,
    tokenQuery,
    width,
    height,
  ]);

  return (
    <Container>
      <ContentContainer>
        <SizingContainer ref={sizingContainerRef}>
          <SearchInput
            hideLabel
            id="tokenQuery"
            type="text"
            label={t("orders.searchByNameOrAddress")}
            value={tokenQuery}
            placeholder={t("orders.searchByNameOrAddress")}
            onChange={(e) => {
              setTokenQuery(e.currentTarget.value);
            }}
          />

          <StyledScrollContainer ref={scrollContainerRef} $overflow={overflow}>
            <Legend>
              <LegendItem>{t("common.token")}</LegendItem>
              <LegendDivider />
              <LegendItem>{t("balances.balance")}</LegendItem>
            </Legend>

            {sortedFilteredTokens && sortedFilteredTokens.length > 0 && (
              <TokenContainer>
                {[nativeCurrency[chainId], ...sortedFilteredTokens].map(
                  (token) => (
                    <TokenButton
                      showDeleteButton={
                        editMode &&
                        token.address !== nativeCurrency[chainId].address
                      }
                      token={token}
                      balance={formatUnits(
                        balances.values[token.address] || 0,
                        token.decimals
                      )}
                      setToken={onSelectToken}
                      removeActiveToken={removeActiveToken}
                      key={token.address}
                    />
                  )
                )}
              </TokenContainer>
            )}
            {inactiveTokens.length !== 0 && (
              <InactiveTokensList
                inactiveTokens={inactiveTokens}
                supportedTokenAddresses={supportedTokenAddresses}
                onTokenClick={(tokenAddress) => {
                  addActiveToken(tokenAddress);
                  setTokenQuery("");
                }}
              />
            )}
            {sortedFilteredTokens.length === 0 && inactiveTokens.length === 0 && (
              <NoResultsContainer>
                <InfoHeading>{t("common.noResultsFound")}</InfoHeading>
              </NoResultsContainer>
            )}
          </StyledScrollContainer>
          <OverlayActionButton
            intent="primary"
            ref={buttonRef}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? t("common.done") : t("orders.editCustomTokens")}
          </OverlayActionButton>
        </SizingContainer>
      </ContentContainer>
    </Container>
  );
};

export default TokenList;
