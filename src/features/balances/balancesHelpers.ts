import { CollectionTokenInfo, TokenKinds } from "@airswap/utils";

import { ethers } from "ethers";

import erc721AbiContract from "../../abis/erc721.json";
import { transformNftToCollectionTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfoTransformers";
import { getOwnedNftsOfCollection } from "../../entities/AppTokenInfo/AppTokenService";
import { getAlchemyClient } from "../../helpers/alchemy";

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
    const [, tokenIds] = await getOwnedNftsOfCollection(
      provider,
      walletAddress,
      collectionToken
    );

    return Object.keys(tokenIds);
  }

  throw new Error("Unknown nft interface. Could not fetch token ids.");
};
