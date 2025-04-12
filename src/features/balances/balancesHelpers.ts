import { CollectionTokenInfo, TokenKinds } from "@airswap/utils";

import { Nft, OwnedBaseNft } from "alchemy-sdk";
import { BigNumber, ethers, Event } from "ethers";

import erc721AbiContract from "../../abis/erc721.json";
import { getAlchemyClient } from "../../helpers/alchemy";
import { getUniqueSingleDimensionArray } from "../../helpers/array";

type TokenIdsWithBalance = {
  [tokenId: string]: string;
};

const getUniqueTokenIds = (tokenIds: BigNumber[]): string[] =>
  tokenIds
    .sort((a, b) => a.sub(b).toNumber())
    .map((t) => t.toString())
    .filter(getUniqueSingleDimensionArray);

export const transformTokensToTokenIdsWithBalance = (
  tokens: string[]
): TokenIdsWithBalance =>
  tokens
    .sort((a, b) => +a - +b)
    .reduce((acc: TokenIdsWithBalance, tokenId: string) => {
      acc[tokenId] = "1";

      return acc;
    }, {});

export const transformOwnedNftsToTokenIdsWithBalance = (
  ownedNfts: OwnedBaseNft[]
): TokenIdsWithBalance =>
  ownedNfts.reduce((acc: TokenIdsWithBalance, ownedNft: OwnedBaseNft) => {
    acc[ownedNft.tokenId] = ownedNft.balance;

    return acc;
  }, {});

export const transformNftToCollectionTokenInfo = (
  nft: Nft,
  chainId: number
): CollectionTokenInfo => ({
  chainId: chainId,
  kind:
    nft.contract.tokenType === "ERC721"
      ? TokenKinds.ERC721
      : TokenKinds.ERC1155,
  address: nft.contract.address,
  id: nft.tokenId,
  image: nft.image.originalUrl,
  name: nft.name,
  uri: nft.tokenUri ?? "",
});

// Probably not needed anymore because we use alchemy to get the owned tokens
const getOwnedErc721TokensByFilteringEvents = async (
  provider: ethers.providers.BaseProvider,
  walletAddress: string,
  collectionToken: string
): Promise<TokenIdsWithBalance> => {
  const contract = new ethers.Contract(
    collectionToken,
    erc721AbiContract.abi,
    provider
  );
  const transferFilter = contract.filters.Transfer(null, walletAddress);

  const events: Event[] = await contract.queryFilter(transferFilter, 0);

  /* get token ids from past events */
  const foundTokenIds: BigNumber[] = events.map((e) => e.args?.at(2));
  const uniqueTokenIds = getUniqueTokenIds(foundTokenIds);

  /* get owners of tokens */
  const tokenOwners: string[] = await Promise.all(
    uniqueTokenIds.map((tokenId) => contract.ownerOf(tokenId))
  );

  /* get only the owned token ids */
  const ownedTokenIds = uniqueTokenIds.filter(
    (_, index) => tokenOwners[index] === walletAddress
  );

  return transformTokensToTokenIdsWithBalance(ownedTokenIds);
};

const getOwnedTokensByAlchemy = async (
  walletAddress: string,
  collectionToken: string,
  chainId: number
): Promise<TokenIdsWithBalance> => {
  const alchemy = getAlchemyClient(chainId);
  const response = await alchemy.nft.getNftsForOwner(walletAddress, {
    contractAddresses: [collectionToken],
    omitMetadata: true,
  });

  return transformOwnedNftsToTokenIdsWithBalance(response.ownedNfts);
};

export const getCollectionTokenInfoByAlchemy = async (
  collectionToken: string,
  tokenId: string,
  chainId: number
): Promise<CollectionTokenInfo | undefined> => {
  const alchemy = getAlchemyClient(chainId);
  const response = await alchemy.nft.getNftMetadata(collectionToken, tokenId);

  if (
    !response ||
    response.tokenType === "NO_SUPPORTED_NFT_STANDARD" ||
    response.tokenType === "NOT_A_CONTRACT" ||
    response.tokenType === "UNKNOWN"
  ) {
    return undefined;
  }

  return transformNftToCollectionTokenInfo(response, chainId);
};

const getNftTokenKind = async (
  provider: ethers.providers.BaseProvider,
  collectionToken: string
): Promise<[boolean, boolean]> => {
  const contract = new ethers.Contract(
    collectionToken,
    erc721AbiContract.abi,
    provider
  );
  return [
    contract.supportsInterface(TokenKinds.ERC721),
    contract.supportsInterface(TokenKinds.ERC1155),
  ];
};

export const getOwnedNftsOfWallet = async (
  provider: ethers.providers.BaseProvider,
  walletAddress: string,
  collectionToken: string
): Promise<string[]> => {
  const [isErc721, isErc1155] = await getNftTokenKind(
    provider,
    collectionToken
  );

  if (isErc721 || isErc1155) {
    const tokenIds = await getOwnedTokensByAlchemy(
      walletAddress,
      collectionToken,
      provider.network.chainId
    );

    return Object.keys(tokenIds);
  }

  throw new Error("Unknown nft interface. Could not fetch token ids.");
};

export const getFirstNftIdCollection = async (
  collectionToken: string,
  chainId: number
): Promise<string[]> => {
  const alchemy = getAlchemyClient(chainId);
  const response = await alchemy.nft.getNftsForContract(collectionToken, {
    pageSize: 1,
  });

  return response.nfts.map((nft: Nft) => nft.tokenId);
};
