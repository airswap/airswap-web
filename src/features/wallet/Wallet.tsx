import React, { useEffect } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useAppDispatch } from "../../app/hooks";
import { setWalletConnected, setWalletDisconnected } from "./walletSlice";
import { fetchAllTokens } from "../metadata/metadataSlice";
import {
  requestActiveTokenAllowances,
  requestActiveTokenBalances,
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

      // Fetch token set balances and allowances.
      // fetchBalancesAndAllowances();

      // Subscribe to changes in balance
      // let tearDowns: (() => void)[];
      // if (activeTokens.length) {
      //   tearDowns = activeTokens.map((tokenInfo) => {
      //     console.log(`subscribing to ${tokenInfo.symbol} transfers`);
      //     return subscribeToTransfers({
      //       tokenAddress: tokenInfo.address,
      //       provider: library,
      //       walletAddress: account!,
      //       onBalanceChange: (amount, direction) => {
      //         console.log(
      //           `${amount.toString()} ${tokenInfo.symbol} ${
      //             direction === "out" ? "sent" : "received"
      //           }`
      //         );
      //       },
      //     });
      //   });
      // }

      // return () => {
      //   if (tearDowns) {
      //     console.log(`tearing down ${tearDowns.length} subs`);
      //     tearDowns.forEach((fn) => fn());
      //   }
      // };
    } else {
      dispatch(setWalletDisconnected());
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
