import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { TokenInfo } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { addUnknownTokenInfo } from "../../../features/metadata/metadataActions";
import scrapeToken from "../../../helpers/scrapeToken";

const useScrapeToken = (
  address: string,
  tokens: TokenInfo[]
): TokenInfo | undefined => {
  const dispatch = useDispatch();
  const { provider: library } = useWeb3React<Web3Provider>();

  const [scrapedToken, setScrapedToken] = useState<TokenInfo | undefined>();

  useEffect(() => {
    if (scrapedToken) {
      dispatch(addUnknownTokenInfo(scrapedToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrapedToken]);

  useEffect(() => {
    if (!library) {
      return;
    }

    if (
      tokens.some(
        (token) => token.address.toLowerCase() === address.toLowerCase()
      )
    ) {
      return;
    }

    const callScrapeToken = async () => {
      const result = await scrapeToken(address, library);
      setScrapedToken(result);
    };

    callScrapeToken();
  }, [address, tokens, library]);

  return scrapedToken;
};

export default useScrapeToken;
