import { FC, useEffect, useState } from "react";
import Modal from "react-modal";

import { Light } from "@airswap/protocols";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import WalletButton from "../../components/WalletButton/WalletButton";
import WalletProviderList from "../../components/WalletProviderList/WalletProviderList";
import {
  AbstractConnector,
  WalletProvider,
} from "../../constants/supportedWalletProviders";
import SUPPORTED_WALLET_PROVIDERS from "../../constants/supportedWalletProviders";
import { subscribeToTransfersAndApprovals } from "../balances/balancesApi";
import {
  decrementBalanceBy,
  incrementBalanceBy,
  requestActiveTokenAllowances,
  requestActiveTokenBalances,
  selectBalances,
  setAllowance,
} from "../balances/balancesSlice";
import { getTransactionsLocalStorageKey } from "../metadata/metadataApi";
import {
  fetchAllTokens,
  selectActiveTokens,
  selectAllTokenInfo,
} from "../metadata/metadataSlice";
import { fetchSupportedTokens } from "../registry/registrySlice";
import {
  revertTransaction,
  mineTransaction,
} from "../transactions/transactionActions";
import {
  selectTransactions,
  setTransactions,
  TransactionsState,
} from "../transactions/transactionsSlice";
import {
  clearLastAccount,
  loadLastAccount,
  saveLastAccount,
} from "./walletAPI";
import {
  setWalletConnected,
  setWalletDisconnected,
  selectWallet,
} from "./walletSlice";

type WalletProps = {
  className?: string;
};

export const Wallet: FC<WalletProps> = ({ className = "" }) => {
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

  // Analytics
  const { trackPageView } = useMatomo();

  // Local component state
  const [showConnectorList, setShowConnectorList] = useState<boolean>(false);
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [connector, setConnector] = useState<AbstractConnector>();
  const [provider, setProvider] = useState<WalletProvider>();

  // Auto-activate if user has connected before on (first render)
  useEffect(() => {
    trackPageView({ documentTitle: "Swap Page", href: "https://airswap.io" });
    const lastConnectedAccount = loadLastAccount();
    if (lastConnectedAccount) {
      setIsActivating(true);
      const connector = lastConnectedAccount.provider.getConnector();
      setConnector(connector);
      setProvider(lastConnectedAccount.provider);
      activate(connector).finally(() => setIsActivating(false));
    }
  }, [activate, trackPageView]);

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
      dispatch(fetchAllTokens());
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
      dispatch(
        fetchSupportedTokens({
          provider: library,
        })
      );
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
        if (tx.status === "processing") {
          let receipt = await library.getTransactionReceipt(tx.hash);
          if (receipt !== null) {
            if (walletHasChanged) return;
            const status = receipt.status;
            if (status === 1) dispatch(mineTransaction(tx.hash));
            // success
            else if (status === 0)
              dispatch(
                revertTransaction({
                  hash: tx.hash,
                  reason: "Reverted",
                })
              ); // reverted
            return;
          } else {
            // Receipt was null, so the transaction is incomplete
            // Try to get a reference to the transaction in the mem pool - this
            // can sometimes also return null (e.g. gas price too low or tx only
            // recently sent) depending on backend.
            const transaction = await library.getTransaction(tx.hash);
            if (transaction) {
              try {
                await transaction.wait(1);
                if (!walletHasChanged) dispatch(mineTransaction(tx.hash)); // success
              } catch (err) {
                console.error(err);
                if (!walletHasChanged)
                  dispatch(
                    revertTransaction({
                      hash: tx.hash,
                      reason: "Reverted",
                    })
                  );
              }
              return;
            } else {
              // if transaction === null, we poll at intervals
              // assume failed after 30 mins
              const assumedFailureTime = Date.now() + 30 * 60 * 1000;
              while (receipt === null && Date.now() <= assumedFailureTime) {
                // wait 30 seconds
                await new Promise((res) => setTimeout(res, 30000));
                receipt = await library!.getTransactionReceipt(tx.hash);
              }
              if (!receipt || receipt.status === 0) {
                if (!walletHasChanged)
                  dispatch(
                    revertTransaction({
                      hash: tx.hash,
                      reason: "Reverted",
                    })
                  );
              } else {
                if (!walletHasChanged) dispatch(mineTransaction(tx.hash)); // success
              }
            }
          }
        }
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
    <div className={className}>
      <Modal
        isOpen={showConnectorList}
        onRequestClose={() => setShowConnectorList(false)}
        overlayClassName="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-10"
        className="w-64 p-4 rounded-sm bg-white dark:bg-gray-800 shadow-lg"
      >
        <WalletProviderList
          onProviderSelected={(provider) => {
            setProvider(provider);
            const connector = provider.getConnector();
            setConnector(connector);
            setShowConnectorList(false);
            setIsActivating(true);
            activate(connector).finally(() => setIsActivating(false));
          }}
        />
      </Modal>
      <WalletButton
        address={account}
        onConnectWalletClicked={() => {
          setShowConnectorList(true);
        }}
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
      />
    </div>
  );
};
