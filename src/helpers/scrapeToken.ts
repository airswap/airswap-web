import {
  CollectionTokenInfo,
  TokenInfo,
  getTokenInfo,
  getTokenKind,
  TokenKinds,
} from "@airswap/utils";

import * as ethers from "ethers";

import { getFirstNftOfCollection } from "../entities/AppTokenInfo/AppTokenService";

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

const scrapeToken = async (
  provider: ethers.providers.BaseProvider,
  tokenAddress: string
): Promise<TokenInfo | CollectionTokenInfo | undefined> => {
  if (!ethers.utils.isAddress(tokenAddress)) {
    return undefined;
  }

  const tokenKind = await getTokenKind(provider, tokenAddress);

  if (tokenKind === TokenKinds.ERC20) {
    const tokenInfo = await callGetTokenInfo(tokenAddress, provider);

    return tokenInfo;
  }

  if (tokenKind === TokenKinds.ERC721 || tokenKind === TokenKinds.ERC1155) {
    const tokenInfo = await getFirstNftOfCollection(provider, tokenAddress);

    return tokenInfo;
  }

  return undefined;
};

export default scrapeToken;
