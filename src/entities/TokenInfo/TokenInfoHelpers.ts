import { TokenInfo } from "@airswap/typescript";

export const isTokenInfo = (tokenInfo: any): tokenInfo is TokenInfo => {
  return (
    typeof tokenInfo === "object" &&
    tokenInfo !== null &&
    "chainId" in tokenInfo &&
    "address" in tokenInfo &&
    "decimals" in tokenInfo &&
    "symbol" in tokenInfo
  );
};
