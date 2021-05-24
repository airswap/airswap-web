import { useCallback, useEffect, useState } from "react";
import { TokenInfo } from "@uniswap/token-lists";
import { useAppDispatch } from "../app/hooks";
import {
  requestSavedActiveTokensAllowances,
  requestSavedActiveTokensBalances,
} from "../features/balances/balancesSlice";
import { useWeb3React } from "@web3-react/core";
import {
  getSavedActiveTokens,
  getSavedActiveTokensInfo,
} from "../features/metadata/metadataApi";

/**
 * @deprecated
 */
const useActiveTokens = () => {
  const dispatch = useAppDispatch();
  const { account, library, chainId } = useWeb3React();

  // populated token set
  const [activeTokens, setActiveTokens] = useState<TokenInfo[]>([]);
  const [activeTokensAddresses, setActiveTokensAddresses] = useState<string[]>(
    []
  );

  const localStorageKey = `airswap/activeTokens/${chainId}`;

  const fetchBalancesAndAllowances = useCallback(() => {
    if (!chainId || !account) return;
    dispatch(
      requestSavedActiveTokensBalances({
        chainId,
        provider: library,
        walletAddress: account,
      })
    );
    dispatch(
      requestSavedActiveTokensAllowances({
        chainId,
        provider: library,
        walletAddress: account,
      })
    );
  }, [account, chainId, dispatch, library]);

  // This effect inits the token set address list when the chainId changes.
  useEffect(() => {
    if (!chainId) return;
    const savedActiveTokensAddresses = getSavedActiveTokens(chainId);
    if (savedActiveTokensAddresses.length) {
      setActiveTokensAddresses(savedActiveTokensAddresses);
    } else {
      setActiveTokensAddresses([]);
    }
  }, [chainId]);

  // This effect populates the metadata for the token set when it changes.
  useEffect(() => {
    if (!chainId || !activeTokensAddresses) {
      setActiveTokens([]);
      return;
    }
    getSavedActiveTokensInfo(chainId).then((activeTokensInfo) => {
      console.log(`setting token set (${activeTokensInfo.length} tokens)`);
      setActiveTokens(activeTokensInfo);
    });
  }, [activeTokensAddresses, chainId]);

  const addAddressToActiveTokens = useCallback(
    (address: string) => {
      const lowerCasedAddress = address.toLowerCase();
      const existingSavedAddressesString =
        localStorage.getItem(localStorageKey) || "";
      let existingSavedAddresses: string[] = [];
      if (existingSavedAddressesString.length) {
        existingSavedAddresses = existingSavedAddressesString.split(",");
      }
      if (!existingSavedAddresses.includes(lowerCasedAddress)) {
        localStorage.setItem(
          localStorageKey,
          existingSavedAddresses +
            `${existingSavedAddresses.length ? "," : ""}${lowerCasedAddress}`
        );
        setActiveTokensAddresses((prev) => [...prev, lowerCasedAddress]);
      }
    },
    [localStorageKey]
  );

  return {
    activeTokens,
    addAddressToActiveTokens,
    fetchBalancesAndAllowances,
  };
};

export default useActiveTokens;
