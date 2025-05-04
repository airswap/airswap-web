import { CollectionTokenInfo } from "@airswap/utils";

import { ethers } from "ethers";

import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenSymbol,
  isCollectionTokenInfo,
  isTokenInfo,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { compareAddresses } from "../../../helpers/string";

/**
 * Create a filter function to apply to a token for whether it matches a particular search query
 * @param search the search query to apply to the token
 */
export function createTokenFilterFunction<T extends AppTokenInfo>(
  search: string
): (tokens: T) => boolean {
  const searchingAddress = ethers.utils.isAddress(search);

  if (searchingAddress) {
    return (t: T) => {
      return t.address.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    };
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0);

  if (lowerSearchParts.length === 0) return () => true;

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0);

    return lowerSearchParts.every(
      (p) =>
        p.length === 0 ||
        sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p))
    );
  };

  return (token: T): boolean => {
    const symbol = getTokenSymbol(token);
    const { name } = token;

    return Boolean(
      (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
    );
  };
}

export function filterTokens(
  tokens: AppTokenInfo[],
  search: string
): AppTokenInfo[] {
  const reducedTokens = reduceNftTokens(tokens);

  return reducedTokens.filter(createTokenFilterFunction(search));
}

/**
 * Reduce the NFT's of a collection to a single token so only one token is shown in the list
 */
export function reduceNftTokens(tokens: AppTokenInfo[]): AppTokenInfo[] {
  const nftTokens = tokens.filter(isCollectionTokenInfo);
  const erc20Tokens = tokens.filter(isTokenInfo);

  const reducedNftTokens = nftTokens.reduce((acc, token) => {
    const existingToken = acc.some((t) =>
      compareAddresses(t.address, token.address)
    );

    if (existingToken) {
      return acc;
    }

    return [...acc, token];
  }, [] as CollectionTokenInfo[]);

  return [...reducedNftTokens, ...erc20Tokens];
}
