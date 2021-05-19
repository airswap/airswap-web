import { useCallback, useEffect, useState } from "react";
import { TokenInfo } from "@uniswap/token-lists";
import {
  getSavedTokenSet,
  getSavedTokenSetInfo,
} from "../features/balances/balancesApi";
import uniqBy from "lodash.uniqby";
import { useAppDispatch } from "../app/hooks";
import { requestSavedTokenSetBalances } from "../features/balances/balancesSlice";
import { useWeb3React } from "@web3-react/core";

const useTokenSet = () => {
  const dispatch = useAppDispatch();
  const { account, library, chainId } = useWeb3React();

  // populated token set
  const [tokenSet, setTokenSet] = useState<TokenInfo[]>([]);
  // token set addresses.
  const [tokenSetAddresses, setTokenSetAddresses] = useState<string[]>([]);

  const localStorageKey = `airswap/tokenSet/${chainId}`;

  useEffect(() => {
    // Not sure when this can happen - perhaps local chain?
    if (!chainId) return;

    const savedTokenSetAddresses = getSavedTokenSet(chainId);
    if (savedTokenSetAddresses.length) {
      setTokenSetAddresses((currentSymbols) =>
        uniqBy(currentSymbols.concat(savedTokenSetAddresses), (i) => i)
      );
    }
  }, [chainId, localStorageKey]);

  useEffect(() => {
    if (!chainId || !tokenSetAddresses.length) {
      setTokenSet([]);
    } else {
      getSavedTokenSetInfo(chainId).then((tokenSetInfo) => {
        setTokenSet(tokenSetInfo);
      });
      if (account) {
        dispatch(
          requestSavedTokenSetBalances({
            chainId,
            provider: library,
            walletAddress: account,
          })
        );
      }
    }
  }, [chainId, tokenSetAddresses, account, dispatch, library]);

  const addAddressToTokenSet = useCallback(
    (address: string) => {
      const existingSavedAddressesString =
        localStorage.getItem(localStorageKey) || "";
      let existingSavedAddresses: string[] = [];
      if (existingSavedAddressesString.length) {
        existingSavedAddresses = existingSavedAddressesString.split(",");
      }
      if (
        !existingSavedAddresses
          .map((s) => s.toLowerCase())
          .includes(address.toLowerCase())
      ) {
        localStorage.setItem(
          localStorageKey,
          existingSavedAddresses +
            `${existingSavedAddresses.length ? "," : ""}${address}`
        );
        setTokenSetAddresses((prev) => [...prev, address]);
      }
    },
    [localStorageKey]
  );

  return { tokenSet, addAddressToTokenSet: addAddressToTokenSet };
};

export default useTokenSet;
