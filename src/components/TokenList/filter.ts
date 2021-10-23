import { TokenInfo } from "@airswap/types";

import { ethers } from "ethers";

/**
 * Create a filter function to apply to a token for whether it matches a particular search query
 * @param search the search query to apply to the token
 */
export function createTokenFilterFunction<T extends TokenInfo>(
  search: string
): (tokens: T) => boolean {
  const searchingAddress = ethers.utils.isAddress(search);

  if (searchingAddress) {
    return (t: T) => t.address.toLowerCase() === search.toLowerCase();
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

  return ({ name, symbol }: T): boolean =>
    Boolean((symbol && matchesSearch(symbol)) || (name && matchesSearch(name)));
}

export function filterTokens<T extends TokenInfo>(
  tokens: T[],
  search: string
): T[] {
  return tokens.filter(createTokenFilterFunction(search));
}
