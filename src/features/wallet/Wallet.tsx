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
  selectAllowances,
  selectBalances,
  setAllowance,
} from "../balances/balancesSlice";
import {
  subscribeToApprovals,
  subscribeToTransfers,
} from "../balances/balancesApi";
import { Light } from "@airswap/protocols";

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
  const balances = useAppSelector(selectBalances);
  const allowances = useAppSelector(selectAllowances);

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
    if (
      !library ||
      !account ||
      chainId === undefined ||
      !activeTokens.length ||
      balances.lastFetch === null ||
      balances.status !== "idle"
    )
      return;

    // Subscribe to changes in balance
    let transferSubTeardowns: (() => void)[];
    if (activeTokens.length) {
      transferSubTeardowns = activeTokens.map((tokenInfo) => {
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
      if (transferSubTeardowns) {
        console.log(
          `tearing down ${transferSubTeardowns.length} transfer subs`
        );
        transferSubTeardowns.forEach((fn) => fn());
      }
    };
  }, [
    activeTokens,
    account,
    library,
    dispatch,
    chainId,
    balances.lastFetch,
    balances.status,
  ]);

  useEffect(() => {
    if (
      !library ||
      !account ||
      chainId === undefined ||
      !activeTokens.length ||
      allowances.lastFetch === null ||
      allowances.status !== "idle"
    )
      return;

    let approvalSubTeardowns: (() => void)[];

    approvalSubTeardowns = activeTokens
      .filter((tokenInfo) => allowances.values[tokenInfo.address] === "0")
      .map((tokenInfo) => {
        console.log(`subscribing to ${tokenInfo.symbol} approvals`);
        return subscribeToApprovals({
          tokenAddress: tokenInfo.address,
          provider: library,
          walletAddress: account,
          spenderAddress: Light.getAddress(chainId),
          onApproval: (amount) => {
            dispatch(
              setAllowance({
                tokenAddress: tokenInfo.address,
                amount,
              })
            );
          },
        });
      });
    return () => {
      if (approvalSubTeardowns) {
        console.log(
          `tearing down ${approvalSubTeardowns.length} approval subs`
        );
        approvalSubTeardowns.forEach((fn) => fn());
      }
    };
  }, [
    account,
    activeTokens,
    allowances.lastFetch,
    allowances.status,
    allowances.values,
    chainId,
    library,
    dispatch,
  ]);

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
