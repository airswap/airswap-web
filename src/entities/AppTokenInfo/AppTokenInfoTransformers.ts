import { CollectionTokenInfo, TokenKinds } from "@airswap/utils";

import { Nft } from "alchemy-sdk";

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
