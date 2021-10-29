import { FC, useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";

import { Light, Wrapper } from "@airswap/libraries";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import EthButton from "../../components/EthButton/EthButton";
import SettingsButton from "../../components/SettingsButton/SettingsButton";
import TransactionsTab from "../../components/TransactionsTab/TransactionsTab";
import WalletButton from "../../components/WalletButton/WalletButton";
import nativeETH from "../../constants/nativeETH";
import {
  AbstractConnector,
  WalletProvider,
} from "../../constants/supportedWalletProviders";
import SUPPORTED_WALLET_PROVIDERS from "../../constants/supportedWalletProviders";
import PopoverContainer from "../../styled-components/PopoverContainer/PopoverContainer";
import { subscribeToTransfersAndApprovals } from "../balances/balancesApi";
import {
  decrementBalanceBy,
  incrementBalanceBy,
  requestActiveTokenAllowancesLight,
  requestActiveTokenAllowancesWrapper,
  requestActiveTokenBalances,
  selectBalances,
  setAllowanceLight,
  setAllowanceWrapper,
} from "../balances/balancesSlice";
import { getTransactionsLocalStorageKey } from "../metadata/metadataApi";
import {
  fetchAllTokens,
  fetchUnkownTokens,
  selectActiveTokens,
  selectAllTokenInfo,
} from "../metadata/metadataSlice";
import {
  swaplistenerSubscribe,
  swaplistenerUnsubscribe,
} from "../orders/ordersSlice";
import { fetchSupportedTokens } from "../registry/registrySlice";
import handleTransaction from "../transactions/handleTransaction";
import {
  selectTransactions,
  setTransactions,
  TransactionsState,
} from "../transactions/transactionsSlice";
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

export const Wallet: FC = () => {
  const {
    chainId,
    account,
    activate,
    deactivate,
    active,
    library,
  } = useWeb3React<Web3Provider>();

  // Redux
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector(selectActiveTokens);
  const balances = useAppSelector(selectBalances);
  const { providerName } = useAppSelector(selectWallet);
  const transactions = useAppSelector(selectTransactions);
  const allTokens = useAppSelector(selectAllTokenInfo);

  // Local component state
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [walletOpen, setWalletOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const [connector, setConnector] = useState<AbstractConnector>();
  const [provider, setProvider] = useState<WalletProvider>();
  const [activated, setActivated] = useState(false);

  useBeforeunload(() => {
    dispatch(
      swaplistenerUnsubscribe({
        library,
        chainId,
      })
    );
  });

  useEffect(() => {
    if (library && chainId && account) {
      dispatch(
        swaplistenerSubscribe({
          account: account!,
          library,
          chainId,
        })
      );
      return () => {
        dispatch(
          swaplistenerUnsubscribe({
            library,
            chainId,
          })
        );
      };
    }
  }, [library, dispatch, chainId, account]);

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
      dispatch(
        requestActiveTokenAllowancesLight({
          provider: library,
        })
      );
      dispatch(
        requestActiveTokenAllowancesWrapper({
          provider: library,
        })
      );

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
        onApproval: (tokenAddress, spenderAddress, amount) => {
          const actionCreator =
            spenderAddress === Wrapper.getAddress().toLowerCase()
              ? setAllowanceWrapper
              : setAllowanceLight;
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
        handleTransaction(tx, walletHasChanged, dispatch, library);
      });
    }
    return () => {
      // Library & dispatch won't change, so when we tear down it's because
      // the wallet has changed. The useEffect will run after this and set up
      // everything for the new wallet.
      walletHasChanged = true;
    };
  }, [chainId, dispatch, library, account]);

  const handleWalletOpen = (state: boolean) => {
    setTransactionsTabOpen(state);
  };

  const handleSettingsOpen = (state: boolean) => {
    setSettingsOpen(state);
    state && setWalletOpen(false);
  };

  return (
    <>
      <PopoverContainer>
        {balances && chainId && (
          <EthButton balance={balances.values[nativeETH[chainId!].address]!} />
        )}
        <WalletButton
          address={account}
          onDisconnectWalletClicked={() => {
            clearLastAccount();
            deactivate();
            if (connector instanceof WalletConnectConnector) {
              connector.close();
            }
          }}
          isConnecting={isActivating}
          tokens={allTokens}
          chainId={chainId!}
          transactions={transactions}
          walletOpen={walletOpen}
          setWalletOpen={handleWalletOpen}
        />
        <SettingsButton
          settingsOpen={settingsOpen}
          setSettingsOpen={handleSettingsOpen}
        />
      </PopoverContainer>
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
      />
    </>
  );
};
