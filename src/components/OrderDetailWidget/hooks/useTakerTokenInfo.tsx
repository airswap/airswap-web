import { useEffect, useMemo, useState } from "react";

import { TokenInfo } from "@uniswap/token-lists";

import { useAppSelector } from "../../../app/hooks";
import { selectAllTokenInfo } from "../../../features/metadata/metadataSlice";
import { selectTakeOtcReducer } from "../../../features/takeOtc/takeOtcSlice";
import findEthOrTokenByAddress from "../../../helpers/findEthOrTokenByAddress";
import scrapeToken from "../../../helpers/scrapeToken";

// OTC Taker version of useTokenInfo. Look at chainId of the active FullOrderERC20 instead
// of active wallet chainId. This way we don't need to connect a wallet to show order tokens.

const useTakerTokenInfo = (address: string | null): TokenInfo | null => {
  const allTokens = useAppSelector(selectAllTokenInfo);
  const { activeOrder } = useAppSelector(selectTakeOtcReducer);

  const [token, setToken] = useState<TokenInfo>();
  const [hasCalledScrapeToken, setHasCalledScrapeToken] = useState(false);

  const chainId = useMemo(
    () => (activeOrder ? parseInt(activeOrder.chainId) : undefined),
    [activeOrder]
  );

  useEffect(() => {
    if (!chainId || !address) {
      return;
    }

    const callScrapeToken = async () => {
      setHasCalledScrapeToken(true);
      const result = await scrapeToken(address, undefined, chainId);
      setToken(result);
    };

    const newToken = findEthOrTokenByAddress(address, allTokens, chainId);

    if (newToken) {
      setToken(newToken);
    } else if (!hasCalledScrapeToken) {
      callScrapeToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTokens, address, chainId]);

  return token || null;
};

export default useTakerTokenInfo;
