import React, { useEffect } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setWalletConnected, setWalletDisconnected } from "./walletSlice";
import { fetchAllTokens, selectActiveTokens } from "../metadata/metadataSlice";
import {
  decrementBalanceBy,
  incrementBalanceBy,
  requestActiveTokenAllowances,
  requestActiveTokenBalances,
} from "../balances/balancesSlice";
import { subscribeToTransfers } from "../balances/balancesApi";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
  ],
});

export const Wallet = () => {
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector(selectActiveTokens);

  const onClick = () => {
    activate(injectedConnector);
  };

  useEffect(() => {
    if (active && account && chainId && library) {
      // Dispatch a general action to indicate wallet has changed
      dispatch(
        setWalletConnected({
          chainId,
          address: account,
        })
      );
      dispatch(fetchAllTokens());
      // TODO: determine if we should remove some of these params
      dispatch(
        requestActiveTokenAllowances({
          provider: library,
        })
      );
      dispatch(
        requestActiveTokenBalances({
          provider: library,
        })
      );
    } else {
      dispatch(setWalletDisconnected());
    }
  }, [active, account, chainId, dispatch, library]);

  useEffect(() => {
    if (!library || !account || !activeTokens.length) return;

    // Subscribe to changes in balance
    let tearDowns: (() => void)[];
    if (activeTokens.length) {
      tearDowns = activeTokens.map((tokenInfo) => {
        console.log(`subscribing to ${tokenInfo.symbol} transfers`);
        return subscribeToTransfers({
          tokenAddress: tokenInfo.address,
          provider: library,
          walletAddress: account,
          onBalanceChange: (amount, direction) => {
            console.log(
              `${amount.toString()} ${tokenInfo.symbol} ${
                direction === "out" ? "sent" : "received"
              }`
            );
            const payload: Parameters<typeof decrementBalanceBy>[0] = {
              tokenAddress: tokenInfo.address,
              amount,
            };
            dispatch(
              direction === "out"
                ? decrementBalanceBy(payload)
                : incrementBalanceBy(payload)
            );
          },
        });
      });
    }
    return () => {
      if (tearDowns) {
        console.log(`tearing down ${tearDowns.length} subs`);
        tearDowns.forEach((fn) => fn());
      }
    };
  }, [activeTokens, account, library, dispatch]);

  return (
    <div>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
      {active ? (
        <div>✅</div>
      ) : (
        <button type="button" onClick={onClick}>
          Connect
        </button>
      )}
    </div>
  );
};
