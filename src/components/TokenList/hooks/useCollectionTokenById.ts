import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useDebounce, useThrottle } from "react-use";

import { CollectionTokenInfo, getCollectionTokenInfo } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../../../app/hooks";
import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenIdentifier,
  isCollectionTokenInfo,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { getOwnedNftsOfWallet } from "../../../entities/BatchCall/BatchCallService";
import {
  addActiveTokens,
  addUnknownTokenInfo,
} from "../../../features/metadata/metadataActions";
import { compareAddresses } from "../../../helpers/string";

export const useCollectionTokenById = (
  collectionToken: CollectionTokenInfo | undefined,
  tokenId: string,
  chainId: number | undefined,
  allTokens: AppTokenInfo[]
): [CollectionTokenInfo | undefined, boolean] => {
  const dispatch = useDispatch();
  const { account } = useAppSelector((state) => state.web3);
  const { provider: library } = useWeb3React<Web3Provider>();
  const [nft, setNft] = useState<CollectionTokenInfo>();
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedTokenId, setDebouncedTokenId] = useState(tokenId);

  useDebounce(
    () => {
      setDebouncedTokenId(tokenId);
    },
    500,
    [tokenId]
  );

  useEffect(() => {
    if (nft) {
      dispatch(addUnknownTokenInfo([nft]));
    }

    const callGetOwnedNfts = async () => {
      if (nft && library && account) {
        const ownedNfts = await getOwnedNftsOfWallet(
          account,
          nft.address,
          [nft.id],
          library
        );
        const nftTokenId = getTokenIdentifier(nft.address, nft.id);

        if (ownedNfts[nftTokenId]) {
          dispatch(addActiveTokens([nftTokenId]));
        }
      }
    };

    callGetOwnedNfts();
  }, [nft]);

  useEffect(() => {
    if (
      !collectionToken ||
      !tokenId ||
      !chainId ||
      !library ||
      isLoading ||
      isNaN(+tokenId)
    ) {
      return;
    }

    if (
      allTokens.some(
        (token) =>
          isCollectionTokenInfo(token) &&
          compareAddresses(token.address, collectionToken.address) &&
          token.id === tokenId
      )
    ) {
      return;
    }

    const fetchNft = async () => {
      try {
        setIsLoading(true);
        const nft = await getCollectionTokenInfo(
          library,
          collectionToken.address,
          tokenId
        );
        setNft(nft);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchNft();
  }, [collectionToken, debouncedTokenId, chainId]);

  return [nft, isLoading];
};
