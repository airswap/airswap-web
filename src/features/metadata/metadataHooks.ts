import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchSupportedTokens } from "../registry/registryActions";
import { fetchAllTokens, fetchProtocolFee } from "./metadataActions";
import {
  getActiveTokensFromLocalStorage,
  getAllTokensFromLocalStorage,
  getCustomTokensFromLocalStorage,
} from "./metadataApi";
import { MetadataTokens, setTokens } from "./metadataSlice";

const useMetadata = () => {
  const dispatch = useAppDispatch();

  const { provider } = useWeb3React();
  const { isActive, account, chainId } = useAppSelector((state) => state.web3);
  const { tokens } = useAppSelector((state) => state.metadata);

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

    const tokens: MetadataTokens = {
      all: getAllTokensFromLocalStorage(chainId),
      active: getActiveTokensFromLocalStorage(account, chainId),
      custom: getCustomTokensFromLocalStorage(account, chainId),
    };

    dispatch(setTokens(tokens));
  }, [account, chainId, provider]);

  useEffect(() => {
    if (!chainId || !provider) {
      return;
    }

    if (chainId === activeChainId) {
      return;
    }

    setActiveChainId(chainId);

    dispatch(fetchAllTokens(chainId));
    dispatch(fetchSupportedTokens({ provider }));
    dispatch(fetchProtocolFee({ chainId, provider: provider! }));
  }, [chainId, provider]);

  useEffect(() => {
    if (!isActive) {
      setActiveAccount(undefined);
      setActiveAccountChainId(undefined);
      setActiveChainId(undefined);
    }
  }, [isActive]);
};

export default useMetadata;
