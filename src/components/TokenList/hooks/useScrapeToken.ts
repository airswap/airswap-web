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
  tokens: AppTokenInfo[]
): [AppTokenInfo | undefined, boolean] => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { provider: library } = useWeb3React<Web3Provider>();

  const [scrapedToken, setScrapedToken] = useState<AppTokenInfo | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scrapedToken) {
      dispatch(addUnknownTokenInfo([scrapedToken]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrapedToken]);

  useEffect(() => {
    if (!library || !account) {
      return;
    }

    if (tokens.some((token) => compareAddresses(token.address, address))) {
      return;
    }

    const callScrapeToken = async () => {
      setIsLoading(true);
      const result = await scrapeToken(library, address);
      setScrapedToken(result);
      setIsLoading(false);
    };

    callScrapeToken();
  }, [address, account, tokens, library]);

  return [scrapedToken, isLoading];
};

export default useScrapeToken;
