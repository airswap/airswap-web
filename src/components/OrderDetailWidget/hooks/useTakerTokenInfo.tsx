import { useEffect, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { TokenInfo } from "@uniswap/token-lists";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  addTokenInfo,
  selectAllTokenInfo,
} from "../../../features/metadata/metadataSlice";
import { selectTakeOtcReducer } from "../../../features/takeOtc/takeOtcSlice";
import findEthOrTokenByAddress from "../../../helpers/findEthOrTokenByAddress";
import scrapeToken from "../../../helpers/scrapeToken";

// OTC Taker version of useTokenInfo. Look at chainId of the active FullOrderERC20 instead
// of active wallet chainId. This way we don't need to connect a wallet to show order tokens.

const useTakerTokenInfo = (address: string | null): TokenInfo | null => {
  const dispatch = useAppDispatch();
  const { library } = useWeb3React<Web3Provider>();

  const allTokens = useAppSelector(selectAllTokenInfo);
  const { activeOrder } = useAppSelector(selectTakeOtcReducer);

  const [token, setToken] = useState<TokenInfo>();
  const [scrapedToken, setScrapedToken] = useState<TokenInfo>();
  const [hasCalledScrapeToken, setHasCalledScrapeToken] = useState(false);

  useEffect(() => {
    if (scrapedToken) {
      dispatch(addTokenInfo(scrapedToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrapedToken]);

  useEffect(() => {
    if (!activeOrder || !address) {
      return;
    }

    const chainId = parseInt(activeOrder.chainId);

    const callScrapeToken = async () => {
      setHasCalledScrapeToken(true);

      // TODO: Fix this when library is undefined
      const result = await scrapeToken(address, library || null, chainId);
      setScrapedToken(result);
    };

    const tokenFromStore = findEthOrTokenByAddress(address, allTokens, chainId);

    if (tokenFromStore) {
      setToken(tokenFromStore);
    } else if (!tokenFromStore && !hasCalledScrapeToken && library) {
      callScrapeToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTokens, address, activeOrder]);

  return token || scrapedToken || null;
};

export default useTakerTokenInfo;
