import { useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { CollectionTokenInfo, TokenKinds } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenId,
  isCollectionTokenInfo,
  isTokenInfo,
} from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { BalancesState } from "../../features/balances/balancesSlice";
import {
  addActiveTokens,
  addQuoteTokens,
  removeActiveTokens,
  removeQuoteTokens,
} from "../../features/metadata/metadataActions";
import { compareAddresses } from "../../helpers/string";
import { OverlayActionButton } from "../ModalOverlay/ModalOverlay.styles";
import {
  Container,
  SearchInput,
  ContentContainer,
  SizingContainer,
} from "./TokenList.styles";
import { getActionButtonText, getTokenIdsFromTokenInfo } from "./helpers";
import { useCollectionTokenById } from "./hooks/useCollectionTokenById";
import useScrapeToken from "./hooks/useScrapeToken";
import { CollectionNftsList } from "./subcomponents/CollectionNftsList/CollectionNftsList";
import TokensAndCollectionsList from "./subcomponents/TokensAndCollectionsList/TokensAndCollectionsList";

export type TokenListProps = {
  /**
   * Whether the token list is for a quote token. This will determine if the nft selector lists the user's token or all tokens.
   */
  isQuoteToken?: boolean;
  /**
   * Balances for current tokens in wallet
   */
  balances: BalancesState;
  /**
   * all Token addresses in metadata.
   */
  allTokens: AppTokenInfo[];
  /**
   * All active tokens.
   */
  activeTokens: AppTokenInfo[];
  /**
   * All quote tokens.
   */
  quoteTokens?: AppTokenInfo[];
  /**
   * Supported tokens according to registry
   */
  supportedTokenAddresses?: string[];
  /**
   * function to handle adding active tokens (dispatches addActiveToken).
   */
  onAfterAddActiveToken?: (val: string) => void;
  /**
   * function to handle removing active tokens (dispatches removeActiveToken).
   */
  onAfterRemoveActiveToken?: (val: string) => void;
  /**
   * Called when a token has been seleced.
   */
  onSelectToken: (val: AppTokenInfo) => void;
};

const TokenList = ({
  isQuoteToken,
  balances,
  allTokens,
  activeTokens = [],
  quoteTokens = [],
  supportedTokenAddresses = [],
  onAfterAddActiveToken,
  onAfterRemoveActiveToken,
  onSelectToken,
}: TokenListProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { provider: library } = useWeb3React<Web3Provider>();
  const { account, chainId } = useAppSelector((state) => state.web3);

  const sizingContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedNftCollection, setSelectedNftCollection] =
    useState<CollectionTokenInfo>();
  const [tokenQuery, setTokenQuery] = useState<string>("");
  const [scrapedTokens, isScrapeTokensLoading] = useScrapeToken(
    tokenQuery,
    allTokens,
    isQuoteToken
  );

  const activeAndQuoteTokens = Array.from(
    new Set([...activeTokens, ...quoteTokens])
  );

  const [, isLoadingCollectionToken] = useCollectionTokenById(
    selectedNftCollection,
    tokenQuery,
    chainId,
    allTokens
  );

  const activeCollectionTokens = useMemo(() => {
    if (!selectedNftCollection) {
      return [];
    }

    return (
      (isQuoteToken ? allTokens : activeTokens)
        .filter((token) =>
          compareAddresses(token.address, selectedNftCollection.address)
        )
        .filter(isCollectionTokenInfo)
        // Don't show unowned NFT tokens for base side
        .filter(
          (token) => isQuoteToken || balances.values[getTokenId(token)] === "1"
        )
    );
  }, [selectedNftCollection, allTokens]);

  const handleAddToken = async (tokenInfo: AppTokenInfo) => {
    if (library && account) {
      const tokenIds = getTokenIdsFromTokenInfo(tokenInfo, allTokens);

      if (isQuoteToken) {
        dispatch(addQuoteTokens(tokenIds));
      } else {
        dispatch(addActiveTokens(tokenIds));
      }

      setTokenQuery("");
      onAfterAddActiveToken && onAfterAddActiveToken(tokenIds[0]);
    }
  };

  const handleRemoveActiveToken = (tokenInfo: AppTokenInfo) => {
    if (library) {
      const tokenIds = getTokenIdsFromTokenInfo(tokenInfo, allTokens);

      dispatch(removeQuoteTokens(tokenIds));
      dispatch(removeActiveTokens(tokenIds));

      onAfterRemoveActiveToken && onAfterRemoveActiveToken(tokenIds[0]);
    }
  };

  const handleSelectToken = (tokenInfo: AppTokenInfo) => {
    if (isTokenInfo(tokenInfo)) {
      onSelectToken(tokenInfo);

      return;
    }

    setTokenQuery("");
    setSelectedNftCollection(tokenInfo);
  };

  const handleSelectCollectionToken = (tokenInfo: CollectionTokenInfo) => {
    setTokenQuery("");
    onSelectToken(tokenInfo);
  };

  const handleActionButtonClick = () => {
    setTokenQuery("");

    if (selectedNftCollection) {
      setSelectedNftCollection(undefined);

      return;
    }

    setEditMode(!editMode);
  };

  return (
    <Container>
      <ContentContainer>
        <SizingContainer ref={sizingContainerRef}>
          <SearchInput
            hideLabel
            id="tokenQuery"
            autoComplete="off"
            type="text"
            label={
              selectedNftCollection
                ? "Search by ID"
                : t("orders.searchByNameOrAddress")
            }
            value={tokenQuery}
            placeholder={
              selectedNftCollection
                ? "Search by ID"
                : t("orders.searchByNameOrAddress")
            }
            onChange={(e) => {
              setTokenQuery(e.currentTarget.value);
            }}
          />

          {selectedNftCollection ? (
            <CollectionNftsList
              isLoading={isLoadingCollectionToken}
              tokens={activeCollectionTokens}
              tokenQuery={tokenQuery}
              onSelectToken={handleSelectCollectionToken}
            />
          ) : (
            <TokensAndCollectionsList
              editMode={editMode}
              isScrapeTokensLoading={isScrapeTokensLoading}
              activeTokens={isQuoteToken ? activeAndQuoteTokens : activeTokens}
              allTokens={allTokens}
              balances={balances}
              scrapedTokens={scrapedTokens}
              supportedTokenAddresses={supportedTokenAddresses}
              tokenQuery={tokenQuery}
              chainId={chainId}
              onSelectToken={handleSelectToken}
              onRemoveActiveToken={handleRemoveActiveToken}
              onAddToken={handleAddToken}
            />
          )}

          <OverlayActionButton
            intent="primary"
            ref={buttonRef}
            onClick={handleActionButtonClick}
          >
            {getActionButtonText(editMode, selectedNftCollection)}
          </OverlayActionButton>
        </SizingContainer>
      </ContentContainer>
    </Container>
  );
};

export default TokenList;
