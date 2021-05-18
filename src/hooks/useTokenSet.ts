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
  const [tokenSetSymbols, setTokenSetSymbols] = useState<string[]>(
    DEFAULT_TOKEN_SET_SYMBOLS
  );
  const [tokenSet, setTokenSet] = useState<TokenInfo[]>([]);
  const dispatch = useAppDispatch();
  const { account, library, chainId } = useWeb3React();

  const localStorageKey = `airswap/tokenSet/${chainId}`;

  useEffect(() => {
    const savedTokenSetSymbols = (localStorage.getItem(localStorageKey) || "")
      .split(",")
      .filter((symbol) => symbol.length);
    if (savedTokenSetSymbols.length) {
      setTokenSetSymbols((currentSymbols) =>
        uniqBy(currentSymbols.concat(savedTokenSetSymbols), (i) => i)
      );
    }
  }, [chainId, localStorageKey]);

  useEffect(() => {
    if (!chainId || !tokenSetSymbols.length) {
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
  }, [chainId, tokenSetSymbols, account, dispatch, library]);

  const addSymbolToTokenSet = useCallback(
    (symbol: string) => {
      const existingSavedSymbolsString =
        localStorage.getItem(localStorageKey) || "";
      let existingSavedSymbols: string[] = [];
      if (existingSavedSymbolsString.length) {
        existingSavedSymbols = existingSavedSymbolsString.split(",");
      }
      if (
        !existingSavedSymbols
          .map((s) => s.toLowerCase())
          .includes(symbol.toLowerCase())
      ) {
        localStorage.setItem(
          localStorageKey,
          existingSavedSymbols +
            `${existingSavedSymbols.length ? "," : ""}${symbol}`
        );
        setTokenSetSymbols((prev) => [...prev, symbol]);
      }
    },
    [localStorageKey]
  );

  return { tokenSet, addSymbolToTokenSet };
};

export default useTokenSet;
