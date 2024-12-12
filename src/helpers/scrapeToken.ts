import { TokenInfo, getTokenInfo as airSwapScrapeToken } from "@airswap/utils";

import * as ethers from "ethers";

const scrapeToken = (
  address: string,
  provider: ethers.providers.BaseProvider,
  chainId?: number
): Promise<TokenInfo | undefined> => {
  return new Promise<TokenInfo | undefined>((resolve) => {
    if (!ethers.utils.isAddress(address)) {
      return resolve(undefined);
    }

    airSwapScrapeToken(provider, address)
      .then(resolve)
      .catch((e) => {
        console.error(e);
        resolve(undefined);
      });
  });
};

export default scrapeToken;
