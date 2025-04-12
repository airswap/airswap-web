import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import { addUnknownTokenInfo } from "../../../features/metadata/metadataActions";
import scrapeToken from "../../../helpers/scrapeToken";
import { compareAddresses } from "../../../helpers/string";

const useScrapeToken = (
  address: string,
  tokens: AppTokenInfo[],
  isQuoteToken = false
): [AppTokenInfo[], boolean] => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { provider: library } = useWeb3React<Web3Provider>();

  const [scrapedTokens, setScrapedTokens] = useState<AppTokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scrapedTokens?.length) {
      dispatch(addUnknownTokenInfo(scrapedTokens));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrapedTokens.length]);

  useEffect(() => {
    if (!library || !account) {
      return;
    }

    if (tokens.some((token) => compareAddresses(token.address, address))) {
      return;
    }

    const callScrapeToken = async () => {
      setIsLoading(true);
      const result = await scrapeToken(
        library,
        address,
        isQuoteToken ? undefined : account
      );
      setScrapedTokens(result);
      setIsLoading(false);
    };

    callScrapeToken();
  }, [address, account, tokens, library]);

  return [scrapedTokens, isLoading];
};

export default useScrapeToken;
