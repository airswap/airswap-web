import { useEffect, useState } from "react";

import { TokenInfo } from "@airswap/utils";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  addActiveToken,
  fetchUnkownTokens,
} from "../../../../features/metadata/metadataActions";
import {
  selectActiveTokenAddresses,
  selectAllTokens,
} from "../../../../features/metadata/metadataSlice";
import { selectTakeOtcReducer } from "../../../../features/takeOtc/takeOtcSlice";
import findEthOrTokenByAddress from "../../../../helpers/findEthOrTokenByAddress";
import useDefaultLibrary from "../../../../hooks/useDefaultLibrary";
import useJsonRpcProvider from "../../../../hooks/useJsonRpcProvider";

// OTC Taker version of useTokenInfo. Look at chainId of the active FullOrderERC20 instead
// of active wallet chainId. This way we don't need to connect a wallet to show order tokens.

const useTakerTokenInfo = (
  address: string | null,
  chainId: number
): [TokenInfo | null, boolean] => {
  const dispatch = useAppDispatch();
  // Using JsonRpcProvider for unconnected wallets or for wallets connected to a different chain
  const library = useJsonRpcProvider(chainId);

  const allTokens = useAppSelector(selectAllTokens);
  const activeTokenAddresses = useAppSelector(selectActiveTokenAddresses);
  const { activeOrder } = useAppSelector(selectTakeOtcReducer);

  const [token, setToken] = useState<TokenInfo>();

  useEffect(() => {
    if (
      address &&
      allTokens.find((token) => token.address === address) &&
      !activeTokenAddresses.includes(address)
    ) {
      // Add as active token so balance and token info will be fetched
      dispatch(addActiveToken(address));
    }
  }, [address, allTokens]);

  useEffect(() => {
    if (!address || !allTokens.length || token || !library) {
      return;
    }

    const tokenFromStore = findEthOrTokenByAddress(address, allTokens, chainId);

    if (tokenFromStore) {
      setToken(tokenFromStore);
    } else {
      dispatch(addActiveToken(address));
      dispatch(fetchUnkownTokens({ provider: library, tokens: [address] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, activeOrder, allTokens.length]);

  return [token || null, false];
};

export default useTakerTokenInfo;
