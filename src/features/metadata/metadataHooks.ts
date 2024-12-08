import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUniqueSingleDimensionArray } from "../../helpers/array";
import { fetchSupportedTokens } from "../registry/registryActions";
import { selectAllSupportedTokens } from "../registry/registrySlice";
import {
  fetchAllTokens,
  fetchProtocolFee,
  fetchUnkownTokens,
} from "./metadataActions";
import {
  getActiveTokensFromLocalStorage,
  getCustomTokensFromLocalStorage,
  getUnknownTokensFromLocalStorage,
} from "./metadataApi";
import {
  selectActiveTokenAddresses,
  selectAllTokens,
  setTokens,
  setUnknownTokens,
} from "./metadataSlice";

const useMetadata = () => {
  const dispatch = useAppDispatch();

  const { provider } = useWeb3React();
  const allTokens = useAppSelector(selectAllTokens);
  const activeTokenAddresses = useAppSelector(selectActiveTokenAddresses);
  const supportedTokenAddresses = useAppSelector(selectAllSupportedTokens);
  const { isActive, account, chainId } = useAppSelector((state) => state.web3);
  const { isFetchingAllTokensSuccess } = useAppSelector(
    (state) => state.metadata
  );
  const { isFetchingSupportedTokensSuccess } = useAppSelector(
    (state) => state.registry
  );

  const [activeAccount, setActiveAccount] = useState<string>();
  const [activeAccountChainId, setActiveAccountChainId] = useState<number>();
  const [activeChainId, setActiveChainId] = useState<number>();

  useEffect(() => {
    if (!account || !chainId || !provider) {
      return;
    }

    if (activeAccount === account && activeAccountChainId === chainId) {
      return;
    }

    setActiveAccount(account);
    setActiveAccountChainId(chainId);

    const active = getActiveTokensFromLocalStorage(account, chainId);
    const custom = getCustomTokensFromLocalStorage(account, chainId);

    dispatch(setTokens({ active, custom }));
  }, [account, chainId, provider]);

  useEffect(() => {
    if (!chainId || !provider || !account) {
      return;
    }

    if (chainId === activeChainId) {
      return;
    }

    const unknownTokens = getUnknownTokensFromLocalStorage(chainId);

    setActiveChainId(chainId);

    if (Object.keys(unknownTokens).length) {
      dispatch(setUnknownTokens(unknownTokens));
    }

    dispatch(fetchAllTokens(chainId));
    dispatch(fetchSupportedTokens({ account, chainId, provider }));
    dispatch(fetchProtocolFee({ chainId, provider }));
  }, [chainId, provider]);

  useEffect(() => {
    if (
      !chainId ||
      !provider ||
      !isFetchingAllTokensSuccess ||
      !isFetchingSupportedTokensSuccess
    ) {
      return;
    }

    const allTokenAddresses = allTokens.map((token) => token.address);
    const activeAndSupportedTokenAddresses = [
      ...activeTokenAddresses,
      ...supportedTokenAddresses,
    ].filter(getUniqueSingleDimensionArray);
    const tokensMissingInfo = activeAndSupportedTokenAddresses.filter(
      (address) => !allTokenAddresses.includes(address)
    );

    if (tokensMissingInfo.length) {
      dispatch(fetchUnkownTokens({ provider, tokens: tokensMissingInfo }));
    }
  }, [isFetchingAllTokensSuccess, isFetchingSupportedTokensSuccess]);

  useEffect(() => {
    if (!isActive) {
      setActiveAccount(undefined);
      setActiveAccountChainId(undefined);
      setActiveChainId(undefined);
    }
  }, [isActive]);
};

export default useMetadata;
