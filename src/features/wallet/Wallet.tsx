import React, { useEffect } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useAppDispatch } from "../../app/hooks";
import { walletConnected } from "./walletActions";
import {
  requestSavedTokenSetAllowances,
  requestSavedTokenSetBalances,
} from "../balances/balancesSlice";

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

  const onClick = () => {
    activate(injectedConnector);
  };

  useEffect(() => {
    if (active && account && chainId && library) {
      // Dispatch a general action to indicate wallet has changed
      dispatch(
        walletConnected({
          chainId,
          account,
        })
      );
      dispatch(
        requestSavedTokenSetBalances({
          chainId,
          provider: library,
          walletAddress: account,
        })
      );
      dispatch(
        requestSavedTokenSetAllowances({
          chainId,
          provider: library,
          walletAddress: account,
        })
      );
    }
  }, [active, account, chainId, dispatch, library]);

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
