import React, { FC, useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import { useTranslation } from "react-i18next";

import { wethAddresses } from "@airswap/constants";
import { Swap, Wrapper } from "@airswap/libraries";
import * as SwapContract from "@airswap/swap/build/contracts/Swap.sol/Swap.json";
//@ts-ignore
import * as swapDeploys from "@airswap/swap/deploys.js";
import { Web3Provider } from "@ethersproject/providers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { Contract } from "ethers";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Weth9Contract from "../../assets/weth9.abi.json";
import TransactionsTab from "../../components/TransactionsTab/TransactionsTab";
import WalletButton from "../../components/WalletButton/WalletButton";
import {
  AbstractConnector,
  WalletProvider,
} from "../../constants/supportedWalletProviders";
import SUPPORTED_WALLET_PROVIDERS from "../../constants/supportedWalletProviders";
import {
  StyledAirswapButton,
  StyledMenuButton,
  StyledSettingsButton,
  TopBar,
} from "../../styled-components/TopBar/Topbar";
import { subscribeToTransfersAndApprovals } from "../balances/balancesApi";
import {
  decrementBalanceBy,
  incrementBalanceBy,
  requestActiveTokenAllowancesSwap,
  requestActiveTokenAllowancesWrapper,
  requestActiveTokenBalances,
  selectBalances,
  setAllowanceSwap,
  setAllowanceWrapper,
} from "../balances/balancesSlice";
import { getTransactionsLocalStorageKey } from "../metadata/metadataApi";
import {
  fetchAllTokens,
  fetchUnkownTokens,
  selectActiveTokens,
  selectAllTokenInfo,
} from "../metadata/metadataSlice";
import { fetchSupportedTokens } from "../registry/registrySlice";
import handleTransaction from "../transactions/handleTransaction";
import subscribeToSwapEvents from "../transactions/swapEventSubscriber";
import {
  selectPendingTransactions,
  selectTransactions,
  setTransactions,
  TransactionsState,
} from "../transactions/transactionsSlice";
import subscribeToWrapEvents from "../transactions/wrapEventSubscriber";
import {
  clearLastAccount,
  loadLastAccount,
  saveLastAccount,
} from "./walletApi";
import {
  selectWallet,
  setWalletConnected,
  setWalletDisconnected,
} from "./walletSlice";

type WalletPropsType = {
  setShowWalletList: (x: boolean) => void;
  transactionsTabOpen: boolean;
  setTransactionsTabOpen: (x: boolean) => void;
  onAirswapButtonClick: () => void;
  onMobileMenuButtonClick: () => void;
};

export const Wallet: FC<WalletPropsType> = ({
  setShowWalletList,
  transactionsTabOpen,
  setTransactionsTabOpen,
  onAirswapButtonClick,
  onMobileMenuButtonClick,
}) => {
  const { t } = useTranslation();
  const {
    chainId,
    account,
    activate,
    deactivate,
    active,
    library,
    error,
  } = useWeb3React<Web3Provider>();

  // Redux
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector(selectActiveTokens);
  const balances = useAppSelector(selectBalances);
  const { providerName } = useAppSelector(selectWallet);
  const transactions = useAppSelector(selectTransactions);
  const pendingTransactions = useAppSelector(selectPendingTransactions);
  const allTokens = useAppSelector(selectAllTokenInfo);

  // Local component state
  const [, setIsActivating] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const [connector, setConnector] = useState<AbstractConnector>();
  const [provider, setProvider] = useState<WalletProvider>();
  const [activated, setActivated] = useState(false);
  const [swapContract, setSwapContract] = useState<Contract>();
  const [wrapContract, setWrapContract] = useState<Contract>();

  useBeforeunload(() => {
    if (swapContract) {
      swapContract.removeAllListeners("Swap");
    }
    if (wrapContract) {
      wrapContract.removeAllListeners("Withdrawal");
      wrapContract.removeAllListeners("Deposit");
    }
  });

  useEffect(() => {
    if (library && chainId && account && swapContract && wrapContract) {
      subscribeToSwapEvents({
        account: account!,
        swapContract,
        library,
        chainId,
        dispatch,
      });
      subscribeToWrapEvents({
        wrapContract,
        library,
        dispatch,
      });
      return () => {
        if (swapContract) {
          swapContract.removeAllListeners("Swap");
        }
        if (wrapContract) {
          wrapContract.removeAllListeners("Withdrawal");
          wrapContract.removeAllListeners("Deposit");
        }
      };
    }
  }, [dispatch, library, chainId, account, swapContract, wrapContract]);
  useEffect(() => {
    if (chainId && account && library) {
      const swapContract = new Contract(
        swapDeploys[chainId],
        SwapContract.abi,
        //@ts-ignore
        library
      );
      setSwapContract(swapContract);
      const wrapContract = new Contract(
        wethAddresses[chainId],
        Weth9Contract.abi,
        //@ts-ignore
        library
      );
      setWrapContract(wrapContract);
    }
  }, [library, chainId, account]);

  // Auto-activate if user has connected before on (first render)
  useEffect(() => {
    const lastConnectedAccount = loadLastAccount();
    if (lastConnectedAccount?.address) {
      setIsActivating(true);
      const connector = lastConnectedAccount.provider.getConnector();
      setConnector(connector);
      setProvider(lastConnectedAccount.provider);
      activate(connector)
        .then(() => {
          setActivated(true);
        })
        .finally(() => {
          setIsActivating(false);
        });
    }
  }, [activate, activated]);

  // Side effects for connecting a wallet from SwapWidget

  useEffect(() => {
    if (providerName) {
      const provider = SUPPORTED_WALLET_PROVIDERS.find(
        (provider) => provider.name === providerName
      );
      setProvider(provider);
      setConnector(provider!.getConnector());
    }
  }, [providerName]);

  // Trigger request for balances and allowances once account is connected
  useEffect(() => {
    if (active && account && chainId && library && connector && provider) {
      // Dispatch a general action to indicate wallet has changed
      dispatch(
        setWalletConnected({
          chainId,
          address: account,
        })
      );
      saveLastAccount(account, provider);

      Promise.all([
        dispatch(fetchAllTokens()),
        dispatch(
          fetchSupportedTokens({
            provider: library,
          } as any)
        ),
      ]).then(() => {
        dispatch(
          requestActiveTokenBalances({
            provider: library,
          })
        );
        dispatch(
          requestActiveTokenAllowancesSwap({
            provider: library,
          })
        );
        dispatch(
          requestActiveTokenAllowancesWrapper({
            provider: library,
          })
        );
        dispatch(
          fetchUnkownTokens({
            provider: library,
          } as any)
        );
      });
    } else {
      dispatch(setWalletDisconnected());
    }
  }, [active, account, chainId, dispatch, library, connector, provider]);

  // Subscribe to changes in balance

  useEffect(() => {
    if (
      !library ||
      !account ||
      !connector ||
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
        spenderAddress: Swap.getAddress(),
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
        onApproval: (tokenAddress, spenderAddress, amount) => {
          const actionCreator =
            spenderAddress === Wrapper.getAddress().toLowerCase()
              ? setAllowanceWrapper
              : setAllowanceSwap;
          dispatch(
            actionCreator({
              tokenAddress,
              amount: amount.toString(),
            })
          );
        },
      });
    }

    return () => {
      if (teardownTransferListener) {
        teardownTransferListener();
      }
    };
  }, [
    activeTokens,
    account,
    library,
    connector,
    dispatch,
    chainId,
    balances.lastFetch,
    balances.status,
  ]);

  useEffect(() => {
    // Create a flag we can set to handle wallet changing between async operations
    let walletHasChanged = false;

    // get transaction state from local storage and update the transactions
    if (chainId && account && library) {
      const transactionsLocalStorage: TransactionsState = JSON.parse(
        localStorage.getItem(
          getTransactionsLocalStorageKey(account!, chainId!)
        )!
      ) || { all: [] };
      dispatch(setTransactions(transactionsLocalStorage));

      // check from all responses if one is pending... if pending, call getTransaction
      // to see if it was a success/failure/pending. update accordingly. if pending: wait()
      // and poll at a sensible interval.
      transactionsLocalStorage.all.forEach(async (tx) => {
        await handleTransaction(tx, walletHasChanged, dispatch, library);
      });
    }
    return () => {
      // Library & dispatch won't change, so when we tear down it's because
      // the wallet has changed. The useEffect will run after this and set up
      // everything for the new wallet.
      walletHasChanged = true;
    };
  }, [chainId, dispatch, library, account]);

  return (
    <>
      <TopBar>
        <StyledMenuButton
          onClick={onMobileMenuButtonClick}
          ariaLabel={t("common.select")}
          icon="menu"
          iconSize={1.5625}
        />
        <StyledSettingsButton
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          transactionsTabOpen={transactionsTabOpen}
        />
        <WalletButton
          address={account}
          isUnsupportedNetwork={
            error && error instanceof UnsupportedChainIdError
          }
          glow={!!pendingTransactions.length}
          setTransactionsTabOpen={() => setTransactionsTabOpen(true)}
          setShowWalletList={setShowWalletList}
        />
        <StyledAirswapButton
          onClick={onAirswapButtonClick}
          ariaLabel={t("common.AirSwap")}
          icon="airswap"
          iconSize={2}
        />
      </TopBar>
      <TransactionsTab
        address={account!}
        chainId={chainId!}
        open={transactionsTabOpen}
        setTransactionsTabOpen={setTransactionsTabOpen}
        onDisconnectWalletClicked={() => {
          clearLastAccount();
          deactivate();
          if (connector instanceof WalletConnectConnector) {
            connector.close();
          }
          setTransactionsTabOpen(false);
        }}
        transactions={transactions}
        tokens={allTokens}
        balances={balances!}
        isUnsupportedNetwork={error && error instanceof UnsupportedChainIdError}
      />
    </>
  );
};
