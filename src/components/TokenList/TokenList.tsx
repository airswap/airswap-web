import { useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { CollectionTokenInfo } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenId,
  isCollectionTokenInfo,
  isTokenInfo,
} from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { getOwnedNftsOfCollection } from "../../entities/AppTokenInfo/AppTokenService";
import { updateNftBalances } from "../../features/balances/balancesActions";
import { BalancesState } from "../../features/balances/balancesSlice";
import {
  addActiveTokens,
  addUnknownTokenInfo,
  removeActiveTokens,
} from "../../features/metadata/metadataActions";
import { compareAddresses } from "../../helpers/string";
import { OverlayActionButton } from "../ModalOverlay/ModalOverlay.styles";
import {
  Container,
  SearchInput,
  ContentContainer,
  SizingContainer,
  RefreshButton,
} from "./TokenList.styles";
import { getActionButtonText, getTokenIdsFromTokenInfo } from "./helpers";
import useScrapeToken from "./hooks/useScrapeToken";
import { CollectionNftsList } from "./subcomponents/CollectionNftsList/CollectionNftsList";
import TokensAndCollectionsList from "./subcomponents/TokensAndCollectionsList/TokensAndCollectionsList";

export type TokenListProps = {
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
   * Supported tokens according to registry
   */
  supportedTokenAddresses?: string[];
  /**
   * function to handle adding active tokens (dispatches addActiveToken).
   */
  onAfterAddActiveToken?: (tokenInfo: AppTokenInfo) => void;
  /**
   * function to handle removing active tokens (dispatches removeActiveToken).
   */
  onAfterRemoveActiveToken?: (tokenInfo: AppTokenInfo) => void;
  /**
   * Called when a token has been seleced.
   */
  onSelectToken: (val: AppTokenInfo) => void;
};

const TokenList = ({
  balances,
  allTokens,
  activeTokens = [],
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
  const [scrapedToken, isScrapeTokensLoading] = useScrapeToken(
    tokenQuery,
    allTokens
  );

  const [isLoadingOwnedNfts, setIsLoadingOwnedNfts] = useState(false);

  const activeCollectionTokens = useMemo(() => {
    if (!selectedNftCollection) {
      return [];
    }

    return activeTokens
      .filter((token) =>
        compareAddresses(token.address, selectedNftCollection.address)
      )
      .filter(isCollectionTokenInfo)
      .filter((token) => balances.values[getTokenId(token)] !== "0");
  }, [selectedNftCollection, allTokens]);

  const handleAddToken = async (tokenInfo: AppTokenInfo) => {
    if (!library || !account) {
      return;
    }

    setTokenQuery("");

    if (isCollectionTokenInfo(tokenInfo)) {
      setIsLoadingOwnedNfts(true);

      const [ownedNfts] = await getOwnedNftsOfCollection(
        library,
        account,
        tokenInfo.address
      );

      const tokenIds = getTokenIdsFromTokenInfo(tokenInfo, ownedNfts);

      dispatch(addUnknownTokenInfo(ownedNfts));
      dispatch(addActiveTokens(tokenIds));

      setIsLoadingOwnedNfts(false);
    } else {
      dispatch(addActiveTokens([tokenInfo.address]));
    }

    onAfterAddActiveToken && onAfterAddActiveToken(tokenInfo);
  };

  const handleRemoveActiveToken = (tokenInfo: AppTokenInfo) => {
    if (library) {
      const tokenIds = getTokenIdsFromTokenInfo(tokenInfo, allTokens);

      dispatch(removeActiveTokens(tokenIds));

      onAfterRemoveActiveToken && onAfterRemoveActiveToken(tokenInfo);
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

  const handleRefreshButtonClick = async () => {
    if (!library || !account || !selectedNftCollection) {
      return;
    }

    setIsLoadingOwnedNfts(true);

    const [ownedNfts] = await getOwnedNftsOfCollection(
      library,
      account,
      selectedNftCollection.address
    );

    const storedOwnedNfts = allTokens
      .filter(isCollectionTokenInfo)
      .filter((token) =>
        compareAddresses(token.address, selectedNftCollection.address)
      )
      .map((token) => getTokenId(token));
    const tokenIds = getTokenIdsFromTokenInfo(selectedNftCollection, ownedNfts);
    const tokensToAdd = tokenIds.filter(
      (token) => !storedOwnedNfts.includes(token)
    );

    if (tokensToAdd.length > 0) {
      dispatch(
        addUnknownTokenInfo(
          ownedNfts.filter((token) => tokensToAdd.includes(getTokenId(token)))
        )
      );
      dispatch(addActiveTokens(tokensToAdd));
    }

    dispatch(updateNftBalances(selectedNftCollection.address, tokenIds));

    setIsLoadingOwnedNfts(false);
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
                ? t("orders.searchById")
                : t("orders.searchByNameOrAddress")
            }
            value={tokenQuery}
            placeholder={
              selectedNftCollection
                ? t("orders.searchById")
                : t("orders.searchByNameOrAddress")
            }
            onChange={(e) => {
              setTokenQuery(e.currentTarget.value);
            }}
          />

          {selectedNftCollection && (
            <RefreshButton icon="swap" onClick={handleRefreshButtonClick} />
          )}

          {selectedNftCollection ? (
            <CollectionNftsList
              isLoading={isLoadingOwnedNfts}
              tokens={activeCollectionTokens}
              tokenQuery={tokenQuery}
              onSelectToken={handleSelectCollectionToken}
            />
          ) : (
            <TokensAndCollectionsList
              editMode={editMode}
              isScrapeTokensLoading={
                isScrapeTokensLoading || isLoadingOwnedNfts
              }
              activeTokens={activeTokens}
              allTokens={allTokens}
              balances={balances}
              scrapedToken={scrapedToken}
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
