import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";
import { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch } from "../../app/hooks";
import nativeCurrency from "../../constants/nativeCurrency";
import {
  BalancesState,
  requestActiveTokenAllowancesSwap,
  requestActiveTokenAllowancesWrapper,
  requestActiveTokenBalances,
} from "../../features/balances/balancesSlice";
import {
  addActiveToken,
  addCustomToken,
  removeActiveToken,
  removeCustomToken,
} from "../../features/metadata/metadataSlice";
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
import useScrapeToken from "./hooks/useScrapeToken";
import { sortTokenByExactMatch, sortTokensBySymbolAndBalance } from "./sort";
import InactiveTokensList from "./subcomponents/InactiveTokensList/InactiveTokensList";
import TokenButton from "./subcomponents/TokenButton/TokenButton";

export type TokenListProps = {
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
  onAfterAddActiveToken?: (val: string) => void;
  /**
   * function to handle removing active tokens (dispatches removeActiveToken).
   */
  onAfterRemoveActiveToken?: (val: string) => void;
};

const TokenList = ({
  onSelectToken,
  balances,
  allTokens,
  activeTokens = [],
  supportedTokenAddresses,
  onAfterAddActiveToken,
  onAfterRemoveActiveToken,
}: TokenListProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { width, height } = useWindowSize();
  const { account, chainId, library } = useWeb3React<Web3Provider>();

  const sizingContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tokenQuery, setTokenQuery] = useState<string>("");

  const scrapedToken = useScrapeToken(tokenQuery, allTokens);

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
      allTokens.filter((token) => !activeTokens.includes(token)),
      tokenQuery
    );
  }, [allTokens, activeTokens, tokenQuery]);

  const inactiveTokens: TokenInfo[] = useMemo(() => {
    // if a scraped token is found, only show that one
    if (scrapedToken) {
      return [scrapedToken];
    }

    // else only take the top 100 tokens
    return filterTokens(Object.values(sortedInactiveTokens), tokenQuery!).slice(
      0,
      100
    );
  }, [sortedInactiveTokens, tokenQuery, scrapedToken]);

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

  const handleAddToken = async (address: string) => {
    const isCustomToken = scrapedToken?.address === address;

    if (library && account) {
      if (isCustomToken) {
        dispatch(addCustomToken(address));
      }
      await dispatch(addActiveToken(address));
      dispatch(requestActiveTokenBalances({ provider: library }));
      dispatch(requestActiveTokenAllowancesSwap({ provider: library }));
      dispatch(requestActiveTokenAllowancesWrapper({ provider: library }));

      onAfterAddActiveToken && onAfterAddActiveToken(address);
    }
  };

  const handleRemoveActiveToken = (address: string) => {
    if (library) {
      dispatch(removeActiveToken(address));
      dispatch(removeCustomToken(address));

      onAfterRemoveActiveToken && onAfterRemoveActiveToken(address);
    }
  };

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
                {[nativeCurrency[chainId || 1], ...sortedFilteredTokens].map(
                  (token) => (
                    <TokenButton
                      showDeleteButton={
                        editMode &&
                        token.address !== nativeCurrency[chainId || 1].address
                      }
                      token={token}
                      balance={formatUnits(
                        balances.values[token.address] || 0,
                        token.decimals
                      )}
                      setToken={onSelectToken}
                      removeActiveToken={handleRemoveActiveToken}
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
                  handleAddToken(tokenAddress);
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
