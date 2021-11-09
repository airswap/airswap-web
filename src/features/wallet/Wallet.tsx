import { FC, useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";

import { Light, Wrapper } from "@airswap/libraries";
import * as LightContract from "@airswap/light/build/contracts/Light.sol/Light.json";
//@ts-ignore
import * as lightDeploys from "@airswap/light/deploys.js";
import { Web3Provider } from "@ethersproject/providers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { Contract } from "ethers";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import EthBalance from "../../components/EthButton/EthBalance";
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
import { fetchSupportedTokens } from "../registry/registrySlice";
import handleTransaction from "../transactions/handleTransaction";
import subscribeToSwapEvents from "../transactions/swapEventSubscriber";
import {
  selectPendingTransactions,
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

type WalletPropsType = {
  setShowWalletList: (x: boolean) => void;
  transactionsTabOpen: boolean;
  setTransactionsTabOpen: (x: boolean) => void;
};

export const Wallet: FC<WalletPropsType> = ({
  setShowWalletList,
  transactionsTabOpen,
  setTransactionsTabOpen,
}) => {
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
  const [lightContract, setLightContract] = useState<Contract>();

  useBeforeunload(() => {
    if (lightContract) {
      lightContract.removeAllListeners("Swap");
    }
  });

  useEffect(() => {
    if (library && chainId && account && lightContract) {
      subscribeToSwapEvents({
        account: account!,
        lightContract,
        //@ts-ignore
        library,
        chainId,
        dispatch,
      });
      return () => {
        if (lightContract) {
          lightContract.removeAllListeners("Swap");
        }
      };
    }
  }, [dispatch, library, chainId, account, lightContract]);
  useEffect(() => {
    if (chainId && account && library) {
      const lightContract = new Contract(
        lightDeploys[chainId],
        LightContract.abi,
        //@ts-ignore
        library
      );
      setLightContract(lightContract);
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
      <PopoverContainer>
        {balances && chainId && (
          <EthBalance balance={balances.values[nativeETH[chainId!].address]!} />
        )}
        <WalletButton
          address={account}
          isUnsupportedNetwork={
            error && error instanceof UnsupportedChainIdError
          }
          glow={!!pendingTransactions.length}
          transactionsTabOpen={transactionsTabOpen}
          setTransactionsTabOpen={() => setTransactionsTabOpen(true)}
          setShowWalletList={setShowWalletList}
        />
        <SettingsButton
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
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
