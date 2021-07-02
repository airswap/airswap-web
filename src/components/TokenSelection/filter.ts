import { TokenInfo } from "@uniswap/token-lists";

/**
 * Create a filter function to apply to a token for whether it matches a particular search query
 * @param search the search query to apply to the token
 */
export function createTokenFilterFunction<T extends TokenInfo>(
  search: string
): (tokens: T) => boolean {
  // const searchingAddress = isAddress(search)

  // if (searchingAddress) {
  //   const lower = searchingAddress.toLowerCase()
  //   return (t: T) => ('isToken' in t ? searchingAddress === t.address : lower === t.address.toLowerCase())
  // }

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
