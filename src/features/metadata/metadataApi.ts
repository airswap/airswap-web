import { TokenInfo, getTokenInfo } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";

import * as ethers from "ethers";

import { getSwapErc20Contract } from "../../helpers/swapErc20";
import { MetadataTokenInfoMap } from "./metadataSlice";

export const getActiveTokensLocalStorageKey: (
  account: string,
  chainId: number
) => string = (account, chainId) =>
  `airswap/activeTokens/${account}/${chainId}`;

export const getUnknownTokensLocalStorageKey: (chainId: number) => string = (
  chainId
) => `airswap/unknownTokens/${chainId}`;

export const getUnknownTokens = async (
  provider: ethers.providers.BaseProvider,
  tokens: string[]
): Promise<TokenInfo[]> => {
  const scrapePromises = tokens.map((t) => getTokenInfo(provider, t));
  const results = await Promise.allSettled(scrapePromises);

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => {
      const tokenInfo = (r as PromiseFulfilledResult<TokenInfo>).value;
      return {
        ...tokenInfo,
        address: tokenInfo.address.toLowerCase(),
      };
    });
};

export const getActiveTokensFromLocalStorage = (
  account: string,
  chainId: number
): string[] | undefined => {
  const savedTokenString = localStorage.getItem(
    getActiveTokensLocalStorageKey(account, chainId)
  );

  try {
    return savedTokenString ? JSON.parse(savedTokenString) : undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const getUnknownTokensFromLocalStorage = (
  chainId: number
): MetadataTokenInfoMap => {
  return JSON.parse(
    localStorage.getItem(getUnknownTokensLocalStorageKey(chainId)) || "{}"
  );
};

export const getProtocolFee = async (
  chainId: number,
  provider: Web3Provider
): Promise<number> => {
  return (
    await getSwapErc20Contract(provider, chainId).protocolFee()
  ).toNumber();
};
