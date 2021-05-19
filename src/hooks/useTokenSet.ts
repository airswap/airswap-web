import { useCallback, useEffect, useState } from "react";
import { TokenInfo } from "@uniswap/token-lists";
import { getSavedTokenSetInfo } from "../features/balances/balancesApi";
import uniqBy from "lodash.uniqby";
import { useAppDispatch } from "../app/hooks";
import { requestSavedTokenSetBalances } from "../features/balances/balancesSlice";
import { useWeb3React } from "@web3-react/core";

const DEFAULT_TOKEN_SET_SYMBOLS = ["WETH", "USDT", "USDC", "DAI", "AST"];

// return defaultTokenSet.concat(
//   (localStorage.getItem(`airswap/tokenSet/${chainId}`) || "")
//     .split(",")
//     .filter((symbol) => symbol.length)
// );

const useTokenSet = () => {
  const [tokenSetAddresses, setTokenSetAddresses] = useState<string[]>(
    DEFAULT_TOKEN_SET_SYMBOLS
  );
  const [tokenSet, setTokenSet] = useState<TokenInfo[]>([]);
  const dispatch = useAppDispatch();
  const { account, library, chainId } = useWeb3React();

  const localStorageKey = `airswap/tokenSet/${chainId}`;

  useEffect(() => {
    const savedTokenSetAddresses = (localStorage.getItem(localStorageKey) || "")
      .split(",")
      .filter((symbol) => symbol.length);
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
