import { useEffect, useState } from "react";

import { TokenInfo } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  addActiveToken,
  addCustomTokenInfo,
  selectActiveTokenAddresses,
  selectAllTokens,
} from "../../../../features/metadata/metadataSlice";
import { selectTakeOtcReducer } from "../../../../features/takeOtc/takeOtcSlice";
import findEthOrTokenByAddress from "../../../../helpers/findEthOrTokenByAddress";
import scrapeToken from "../../../../helpers/scrapeToken";

// OTC Taker version of useTokenInfo. Look at chainId of the active FullOrderERC20 instead
// of active wallet chainId. This way we don't need to connect a wallet to show order tokens.

const useTakerTokenInfo = (
  address: string | null
): [TokenInfo | null, boolean] => {
  const dispatch = useAppDispatch();
  const { provider: library } = useWeb3React<Web3Provider>();
  const { isActive } = useAppSelector((state) => state.web3);

  const allTokens = useAppSelector(selectAllTokens);
  const activeTokenAddresses = useAppSelector(selectActiveTokenAddresses);
  const { activeOrder } = useAppSelector(selectTakeOtcReducer);

  const [token, setToken] = useState<TokenInfo>();
  const [scrapedToken, setScrapedToken] = useState<TokenInfo>();
  const [isCallScrapeTokenLoading, setIsCallScrapeTokenLoading] =
    useState(false);
  const [isCallScrapeTokenSuccess, setIsCallScrapeTokenSuccess] =
    useState(false);

  useEffect(() => {
    if (scrapedToken) {
      dispatch(addCustomTokenInfo(scrapedToken));
    }
  }, [scrapedToken]);

  useEffect(() => {
    if (
      address &&
      allTokens.find((token) => token.address === address) &&
      !activeTokenAddresses.includes(address)
    ) {
      // Add as active token so balance will be fetched
      dispatch(addActiveToken(address));
    }
  }, [address, allTokens]);

  useEffect(() => {
    if (!activeOrder || !address || !allTokens.length) {
      return;
    }

    const chainId = activeOrder.chainId;

    const callScrapeToken = async () => {
      setIsCallScrapeTokenLoading(true);

      if (library) {
        const result = await scrapeToken(address, library);
        if (result) {
          setScrapedToken(result);
        }
        setIsCallScrapeTokenSuccess(true);
      } else {
        setIsCallScrapeTokenSuccess(false);
      }
      setIsCallScrapeTokenLoading(false);
    };

    const tokenFromStore = findEthOrTokenByAddress(address, allTokens, chainId);

    if (tokenFromStore) {
      setToken(tokenFromStore);
    } else if (
      !tokenFromStore &&
      !isCallScrapeTokenLoading &&
      !isCallScrapeTokenSuccess
    ) {
      callScrapeToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTokens, address, activeOrder, isActive]);

  return [token || scrapedToken || null, isCallScrapeTokenLoading];
};

export default useTakerTokenInfo;
