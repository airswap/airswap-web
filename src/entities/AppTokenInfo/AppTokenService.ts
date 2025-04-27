import { CollectionTokenInfo } from "@airswap/utils";

import { OwnedNft } from "alchemy-sdk";
import { ethers } from "ethers";

import { getAlchemyClient } from "../../helpers/alchemy";
import { transformNftToCollectionTokenInfo } from "./AppTokenInfoTransformers";

export const getFirstNftOfCollection = async (
  provider: ethers.providers.BaseProvider,
  tokenAddress: string
): Promise<CollectionTokenInfo | undefined> => {
  const alchemy = getAlchemyClient(provider.network.chainId);
  const response = await alchemy.nft.getNftsForContract(tokenAddress, {
    pageSize: 1,
  });

  const nft = response.nfts[0];

  if (
    !response ||
    nft.tokenType === "NO_SUPPORTED_NFT_STANDARD" ||
    nft.tokenType === "NOT_A_CONTRACT" ||
    nft.tokenType === "UNKNOWN"
  ) {
    return undefined;
  }

  return transformNftToCollectionTokenInfo(nft, provider.network.chainId);
};

type TokenIdsWithBalance = {
  [tokenId: string]: string;
};

export const transformOwnedNftsToTokenIdsWithBalance = (
  ownedNfts: OwnedNft[]
): TokenIdsWithBalance =>
  ownedNfts.reduce((acc: TokenIdsWithBalance, ownedNft: OwnedNft) => {
    acc[ownedNft.tokenId] = ownedNft.balance;

    return acc;
  }, {});

export const getOwnedNftsOfCollection = async (
  provider: ethers.providers.BaseProvider,
  walletAddress: string,
  collectionToken: string
): Promise<[CollectionTokenInfo[], TokenIdsWithBalance]> => {
  const alchemy = getAlchemyClient(provider.network.chainId);
  const response = await alchemy.nft.getNftsForOwner(walletAddress, {
    contractAddresses: [collectionToken],
  });

  return [
    response.ownedNfts.map((nft) =>
      transformNftToCollectionTokenInfo(nft, provider.network.chainId)
    ),
    transformOwnedNftsToTokenIdsWithBalance(response.ownedNfts),
  ];
};
