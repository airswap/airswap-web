import { scrapeToken as airSwapScrapeToken } from "@airswap/metadata";
import { TokenInfo } from "@uniswap/token-lists";

import * as ethers from "ethers";

const scrapeToken = (
  address: string,
  provider?: ethers.providers.BaseProvider | string,
  chainId?: number
): Promise<TokenInfo | undefined> => {
  return new Promise<TokenInfo | undefined>(async (resolve) => {
    if (!ethers.utils.isAddress(address)) {
      return resolve(undefined);
    }

    try {
      const tokenInfo = await airSwapScrapeToken(address, provider, chainId);
      resolve(tokenInfo);
    } catch (e) {
      console.error(e);
      resolve(undefined);
    }
  });
};

export default scrapeToken;
