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
  selectBalances,
  setAllowance,
} from "../balances/balancesSlice";
import { subscribeToTransfersAndApprovals } from "../balances/balancesApi";
import { Light } from "@airswap/protocols";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button/Button";

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

  const { t } = useTranslation(["common", "wallet"]);

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

  // Subscribe to changes in balance
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

    let teardownTransferListener: () => void;
    if (activeTokens.length) {
      teardownTransferListener = subscribeToTransfersAndApprovals({
        activeTokenAddresses: activeTokens.map((t) => t.address),
        provider: library,
        walletAddress: account,
        spenderAddress: Light.getAddress(),
        onBalanceChange: (tokenAddress, amount, direction) => {
          const actionCreator =
            direction === "in" ? incrementBalanceBy : decrementBalanceBy;
          dispatch(
            actionCreator({
              tokenAddress,
              amount: amount.toString(),
            })
          );
        },
        onApproval: (tokenAddress, amount) => {
          dispatch(
            setAllowance({
              tokenAddress,
              amount: amount.toString(),
            })
          );
        },
      });
    }
    return () => {
      if (teardownTransferListener) {
        console.log(`tearing down Transfer listener`);
        teardownTransferListener();
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

  return (
    <div>
      <div>
        {t("common:chainId")}: {chainId}
      </div>
      <div>
        {t("common:account")}: {account}
      </div>
      {active ? (
        <div>✅</div>
      ) : (
        <Button type="button" intent="primary" onClick={onClick}>
          {t("wallet:connectWallet")}
        </Button>
      )}
    </div>
  );
};
