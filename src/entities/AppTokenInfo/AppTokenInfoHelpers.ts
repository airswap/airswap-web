import { CollectionTokenInfo, TokenInfo, TokenKinds } from "@airswap/utils";

import { BigNumber } from "bignumber.js";
import { isAddress } from "ethers/lib/utils";

import { BalancesState } from "../../features/balances/balancesSlice";
import { compareAddresses } from "../../helpers/string";
import { AppTokenInfo } from "./AppTokenInfo";

export const isTokenInfo = (
  tokenInfo: AppTokenInfo
): tokenInfo is TokenInfo => {
  return "symbol" in tokenInfo;
};

export const isCollectionTokenInfo = (
  tokenInfo: AppTokenInfo
): tokenInfo is CollectionTokenInfo => {
  return (
    "kind" in tokenInfo &&
    (tokenInfo.kind === TokenKinds.ERC1155 ||
      tokenInfo.kind === TokenKinds.ERC721)
  );
};

export const isNftTokenId = (tokenId: string): boolean => {
  const [address, id] = tokenId.split("-");

  return isAddress(address) && !!id;
};

export const getTokenIdentifier = (address: string, id?: string): string => {
  return id ? `${address}-${id}` : address;
};

export const getTokenIdentifierWithKind = (
  address: string,
  id?: string,
  kind?: TokenKinds
): string => {
  return getTokenIdentifier(
    address,
    kind !== TokenKinds.ERC20 ? id : undefined
  );
};

// token id is the identifier for the token in the store
export const getTokenId = (tokenInfo: AppTokenInfo): string => {
  return getTokenIdentifier(
    tokenInfo.address,
    isCollectionTokenInfo(tokenInfo) ? tokenInfo.id : undefined
  );
};

export const splitTokenIdentifier = (
  tokenId: string
): { address: string; id?: string } => {
  const [address, id] = tokenId.split("-");

  return { address, id };
};

export const getAddressFromTokenIdentifier = (tokenId: string): string =>
  splitTokenIdentifier(tokenId).address;

export const getIdFromTokenIdentifier = (tokenId: string): string =>
  splitTokenIdentifier(tokenId).id || "0";

export const getTokenDecimals = (tokenInfo: AppTokenInfo): number => {
  return isTokenInfo(tokenInfo) ? tokenInfo.decimals : 0;
};

export const getTokenSymbol = (tokenInfo: AppTokenInfo): string => {
  return isTokenInfo(tokenInfo) ? tokenInfo.symbol : tokenInfo.name || "";
};

export const getTokenImage = (tokenInfo: AppTokenInfo): string | undefined => {
  return isTokenInfo(tokenInfo) ? tokenInfo.logoURI : tokenInfo.image;
};

export const getTokenKind = (tokenInfo: AppTokenInfo): TokenKinds => {
  if (isTokenInfo(tokenInfo)) {
    return TokenKinds.ERC20;
  }

  return tokenInfo.kind === TokenKinds.ERC1155
    ? TokenKinds.ERC1155
    : TokenKinds.ERC721;
};

export const getCollectionTokenName = (
  tokenInfo: CollectionTokenInfo
): string => {
  return (tokenInfo.name?.split("#")[0] || "").trim();
};

export const getTokenBalance = (
  tokenInfo: AppTokenInfo,
  balances: BalancesState
): string => {
  if (isTokenInfo(tokenInfo)) {
    return balances.values[getTokenId(tokenInfo)] || "0";
  }

  const balancesForTokenIds = Object.keys(balances.values).filter((tokenId) => {
    const { address, id } = splitTokenIdentifier(tokenId);

    return !!id && compareAddresses(address, tokenInfo.address);
  });

  const balance = balancesForTokenIds.reduce((acc, tokenId) => {
    return acc.plus(balances.values[tokenId] || "0");
  }, new BigNumber(0));

  return balance.toString();
};

export const findTokenByAddressAndId = (
  tokens: AppTokenInfo[],
  address: string,
  id?: string
) => {
  return tokens.find((token) => {
    if (!id || isTokenInfo(token)) {
      return compareAddresses(token.address, address);
    }

    return compareAddresses(token.address, address) && token.id === id;
  });
};
