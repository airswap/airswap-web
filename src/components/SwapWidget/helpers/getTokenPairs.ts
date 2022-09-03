import { TokenSelectModalTypes } from "../../../types/tokenSelectModalTypes";

export default function getTokenPairs(
  type: TokenSelectModalTypes,
  value: string,
  quoteToken: string | null,
  baseToken: string | null
): { tokenFrom: string | null; tokenTo: string | null } {
  if (type === "base") {
    return value === quoteToken
      ? { tokenFrom: value, tokenTo: baseToken }
      : { tokenFrom: value, tokenTo: quoteToken };
  } else {
    return value === baseToken
      ? { tokenFrom: quoteToken, tokenTo: value }
      : { tokenFrom: baseToken, tokenTo: value };
  }
}
