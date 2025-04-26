import {
  CollectionTokenInfo,
  TokenInfo,
  getTokenInfo,
  getCollectionTokenInfo,
  getTokenKind,
  TokenKinds,
} from "@airswap/utils";

import * as ethers from "ethers";

import { getOwnedNftsOfWallet } from "../features/balances/balancesHelpers";

const callGetTokenInfo = (
  address: string,
  provider: ethers.providers.BaseProvider
) => {
  return getTokenInfo(provider, address)
    .then((tokenInfo) => {
      return tokenInfo;
    })
    .catch((e) => {
      console.error("[callGetTokenInfo]", e);
      return undefined;
    });
};

const callGetCollectionTokenInfo = (
  provider: ethers.providers.BaseProvider,
  address: string,
  tokenId: string
) => {
  return getCollectionTokenInfo(provider, address, tokenId)
    .then((tokenInfo) => {
      return tokenInfo;
    })
    .catch((e) => {
      console.error("[callGetCollectionTokenInfo]", e);
      return undefined;
    });
};

const fetchTokenInfosSequentially = async (
  provider: ethers.providers.BaseProvider,
  tokenAddress: string,
  ownedTokens: string[]
): Promise<CollectionTokenInfo[]> => {
  const tokenInfos = [];

  for (const tokenId of ownedTokens) {
    const tokenInfo = await callGetCollectionTokenInfo(
      provider,
      tokenAddress,
      tokenId
    );
    if (tokenInfo !== undefined) {
      tokenInfos.push(tokenInfo);
    }
  }

  return tokenInfos;
};

const scrapeToken = async (
  provider: ethers.providers.BaseProvider,
  tokenAddress: string,
  walletAddress: string
): Promise<(TokenInfo | CollectionTokenInfo)[]> => {
  if (!ethers.utils.isAddress(tokenAddress)) {
    return [];
  }

  const tokenKind = await getTokenKind(provider, tokenAddress);

  if (tokenKind === TokenKinds.ERC20) {
    const tokenInfo = await callGetTokenInfo(tokenAddress, provider);

    return tokenInfo ? [tokenInfo] : [];
  }

  if (tokenKind === TokenKinds.ERC721 || tokenKind === TokenKinds.ERC1155) {
    const ownedTokens = await getOwnedNftsOfWallet(
      provider,
      walletAddress,
      tokenAddress
    );
    const tokenInfos = await fetchTokenInfosSequentially(
      provider,
      tokenAddress,
      ownedTokens
    );

    return tokenInfos.filter((tokenInfo) => tokenInfo !== undefined);
  }

  return [];
};

export default scrapeToken;
