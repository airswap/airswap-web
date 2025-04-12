import { useEffect, useState } from "react";

import { TokenKinds } from "@airswap/utils";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { AppTokenInfo } from "../../../../entities/AppTokenInfo/AppTokenInfo";
import { getTokenIdentifierWithKind } from "../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import {
  addActiveTokens,
  addQuoteTokens,
  fetchUnkownTokens,
} from "../../../../features/metadata/metadataActions";
import {
  selectActiveTokenAddresses,
  selectAllTokens,
  selectQuoteTokenAddresses,
} from "../../../../features/metadata/metadataSlice";
import { selectTakeOtcReducer } from "../../../../features/takeOtc/takeOtcSlice";
import findEthOrTokenByAddress from "../../../../helpers/findEthOrTokenByAddress";
import useJsonRpcProvider from "../../../../hooks/useJsonRpcProvider";

// OTC Taker version of useTokenInfo. Look at chainId of the active FullOrderERC20 instead
// of active wallet chainId. This way we don't need to connect a wallet to show order tokens.

type UseTakerTokenInfoProps = {
  address: string | null;
  chainId: number;
  tokenId?: string;
  tokenKind?: TokenKinds;
  isQuoteToken?: boolean;
};

const useTakerTokenInfo = ({
  address,
  chainId,
  tokenId,
  tokenKind = TokenKinds.ERC20,
  isQuoteToken = false,
}: UseTakerTokenInfoProps): [AppTokenInfo | null, boolean] => {
  const dispatch = useAppDispatch();
  // Using JsonRpcProvider for unconnected wallets or for wallets connected to a different chain
  const library = useJsonRpcProvider(chainId);

  const allTokens = useAppSelector(selectAllTokens);
  const activeTokenAddresses = useAppSelector(selectActiveTokenAddresses);
  const quoteTokenAddresses = useAppSelector(selectQuoteTokenAddresses);
  const activeAndQuoteTokenAddresses = [
    ...activeTokenAddresses,
    ...quoteTokenAddresses,
  ];
  const { activeOrder } = useAppSelector(selectTakeOtcReducer);

  const [token, setToken] = useState<AppTokenInfo>();

  useEffect(() => {
    if (
      address &&
      findEthOrTokenByAddress(address, allTokens, chainId, tokenId) &&
      !activeAndQuoteTokenAddresses.includes(address)
    ) {
      console.log("useEffect", address, tokenId, tokenKind);
      const id = getTokenIdentifierWithKind(address, tokenId, tokenKind);
      dispatch(isQuoteToken ? addQuoteTokens([id]) : addActiveTokens([id]));
    }
  }, [address, allTokens]);

  useEffect(() => {
    if (!address || !allTokens.length || token || !library) {
      return;
    }

    const tokenFromStore = findEthOrTokenByAddress(
      address,
      allTokens,
      chainId,
      tokenId
    );

    if (tokenFromStore) {
      setToken(tokenFromStore);
    } else {
      const id = getTokenIdentifierWithKind(address, tokenId, tokenKind);
      dispatch(isQuoteToken ? addQuoteTokens([id]) : addActiveTokens([id]));
      // Add nft to fetchUnkownTokens
      dispatch(fetchUnkownTokens({ provider: library, tokens: [address] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, activeOrder, allTokens.length]);

  return [token || null, false];
};

export default useTakerTokenInfo;
