import { useEffect } from "react";
import { useDebounce } from "react-use";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearedCachedLibrary, setCachedLibrary } from "../../helpers/ethers";
import { walletChanged, walletDisconnected } from "./web3Actions";
import { setLibraries, setWeb3Data } from "./web3Slice";

const useWeb3ReactRouteDebounceDuration = 100;

const useWeb3 = (): void => {
  const dispatch = useAppDispatch();

  const {
    isActive: storeIsActive,
    isInitialized,
    libraries,
  } = useAppSelector((state) => state.web3);

  const { isActive, account, chainId, provider: library } = useWeb3React();

  // Using debounce because useWeb3React disconnects from provider every route for a split second
  useDebounce(
    () => {
      dispatch(
        setWeb3Data({
          isActive,
          account: account || undefined,
          chainId,
        })
      );
    },
    useWeb3ReactRouteDebounceDuration,
    [isActive, account, chainId, library]
  );

  useDebounce(
    () => {
      if (!library) {
        clearedCachedLibrary();

        return;
      }

      if (library && chainId) {
        setCachedLibrary(library, chainId);
        dispatch(
          setLibraries({
            ...libraries,
            [chainId]: true,
          })
        );
      }
    },
    100,
    [library]
  );

  useEffect(() => {
    if (isInitialized && !storeIsActive) {
      dispatch(walletDisconnected());
    }
  }, [storeIsActive]);

  useEffect(() => {
    if (isInitialized && isActive && account) {
      dispatch(walletChanged());
    }
  }, [account]);
};

export default useWeb3;
