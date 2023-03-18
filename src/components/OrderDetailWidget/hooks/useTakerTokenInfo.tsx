import { useEffect, useState } from "react";

import { TokenInfo } from "@airswap/types";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { getDefaultProvider } from "ethers";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getAllTokensFromLocalStorage } from "../../../features/metadata/metadataApi";
import {
  addTokenInfo,
  selectAllTokenInfo,
} from "../../../features/metadata/metadataSlice";
import { selectTakeOtcReducer } from "../../../features/takeOtc/takeOtcSlice";
import { selectWallet } from "../../../features/wallet/walletSlice";
import findEthOrTokenByAddress from "../../../helpers/findEthOrTokenByAddress";
import { getRpcUrl } from "../../../helpers/getRpcUrl";
import scrapeToken from "../../../helpers/scrapeToken";

// OTC Taker version of useTokenInfo. Look at chainId of the active FullOrderERC20 instead
// of active wallet chainId. This way we don't need to connect a wallet to show order tokens.

const useTakerTokenInfo = (
  address: string | null
): [TokenInfo | null, boolean] => {
  const dispatch = useAppDispatch();
  const { library } = useWeb3React<Web3Provider>();

  const { connected } = useAppSelector(selectWallet);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const { activeOrder } = useAppSelector(selectTakeOtcReducer);

  const [token, setToken] = useState<TokenInfo>();
  const [scrapedToken, setScrapedToken] = useState<TokenInfo>();
  const [isCallScrapeTokenLoading, setIsCallScrapeTokenLoading] =
    useState(false);
  const [isCallScrapeTokenSuccess, setIsCallScrapeTokenSuccess] =
    useState(false);

  useEffect(() => {
    if (scrapedToken) {
      dispatch(addTokenInfo(scrapedToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrapedToken]);

  useEffect(() => {
    if (!activeOrder || !address || !allTokens.length) {
      return;
    }

    const chainId = activeOrder.chainId;

    // If wallet is not connected the metadata tokens can't be filled yet because it gets chainId from
    // the wallet. But in this case we have the chainId from the order already. So we can get tokens from
    // localStorage directly so we don't have to wait for the wallet getting connected.

    const tokensObject = getAllTokensFromLocalStorage(chainId);

    const tokens = [
      ...allTokens,
      ...(!connected ? Object.values(tokensObject) : []),
    ];

    const callScrapeToken = async () => {
      setIsCallScrapeTokenLoading(true);

      const lib = library || getDefaultProvider(getRpcUrl(activeOrder.chainId));

      if (lib) {
        const result = await scrapeToken(address, lib);
        if (result) {
          setScrapedToken(result);
        }
        setIsCallScrapeTokenSuccess(true);
      } else {
        setIsCallScrapeTokenSuccess(false);
      }
      setIsCallScrapeTokenLoading(false);
    };

    const tokenFromStore = findEthOrTokenByAddress(address, tokens, chainId);

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
  }, [allTokens, address, activeOrder, connected]);

  return [token || scrapedToken || null, isCallScrapeTokenLoading];
};

export default useTakerTokenInfo;
