import React, { FC, useContext, useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import { useTranslation } from "react-i18next";

import { SwapERC20, WETH, Wrapper } from "@airswap/libraries";
import { Web3Provider } from "@ethersproject/providers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { Contract } from "ethers";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import TransactionsTab from "../../components/TransactionsTab/TransactionsTab";
import {
  AbstractConnector,
  WalletProvider,
} from "../../constants/supportedWalletProviders";
import SUPPORTED_WALLET_PROVIDERS from "../../constants/supportedWalletProviders";
import { InterfaceContext } from "../../contexts/interface/Interface";
import {
  StyledAirswapButton,
  StyledChainSelector,
  StyledMenuButton,
  StyledSettingsButton,
  StyledWalletButton,
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
import {
  fetchAllTokens,
  fetchProtocolFee,
  fetchUnkownTokens,
  selectActiveTokens,
  selectAllTokenInfo,
  selectMetaDataReducer,
} from "../metadata/metadataSlice";
import { fetchSupportedTokens } from "../registry/registrySlice";
import subscribeToSwapEvents from "../transactions/swapEventSubscriber";
import {
  selectPendingTransactions,
  selectTransactions,
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
  onAirswapButtonClick: () => void;
  onMobileMenuButtonClick: () => void;
};

export const Wallet: FC<WalletPropsType> = ({
  onAirswapButtonClick,
  onMobileMenuButtonClick,
}) => {
  const { t } = useTranslation();
  const { chainId, account, activate, deactivate, active, library, error } =
    useWeb3React<Web3Provider>();

  // Redux
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector(selectActiveTokens);
  const balances = useAppSelector(selectBalances);
  const { providerName } = useAppSelector(selectWallet);
  const transactions = useAppSelector(selectTransactions);
  const pendingTransactions = useAppSelector(selectPendingTransactions);
  const { isFetchingAllTokens } = useAppSelector(selectMetaDataReducer);
  const allTokens = useAppSelector(selectAllTokenInfo);

  // Interface context
  const { transactionsTabIsOpen, setShowWalletList, setTransactionsTabIsOpen } =
    useContext(InterfaceContext);

  // Local component state
  const [, setIsActivating] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [chainsOpen, setChainsOpen] = useState<boolean>(false);

  const [connector, setConnector] = useState<AbstractConnector>();
  const [provider, setProvider] = useState<WalletProvider>();
  const [activated, setActivated] = useState(false);
  const [swapContract, setSwapContract] = useState<Contract>();
  const [wrapContract, setWrapContract] = useState<Contract>();

  useBeforeunload(() => {
    if (swapContract) {
      swapContract.removeAllListeners("SwapERC20");
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
          swapContract.removeAllListeners("SwapERC20");
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
      setSwapContract(SwapERC20.getContract(library, chainId));
      setWrapContract(WETH.getContract(library, chainId));
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
      dispatch(fetchProtocolFee({ chainId, provider: library }));
      saveLastAccount(account, provider);
      Promise.all([
        ...(!isFetchingAllTokens
          ? [dispatch(fetchAllTokens(chainId) as any)]
          : []),
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
    } else if (!active) {
      dispatch(setWalletDisconnected());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, active]);

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
        spenderAddress: SwapERC20.getAddress(chainId),
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
            spenderAddress === Wrapper.getAddress(chainId)
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

  return (
    <>
      <TopBar>
        <StyledAirswapButton
          onClick={onAirswapButtonClick}
          ariaLabel={t("common.AirSwap")}
          icon="airswap"
          iconSize={2}
        />
        {chainId && (
          <StyledChainSelector
            chainId={chainId}
            chainSelectionOpen={chainsOpen}
            transactionsTabOpen={transactionsTabIsOpen}
            setChainSelectionOpen={setChainsOpen}
          />
        )}
        <StyledWalletButton
          isConnected={active}
          isUnsupportedNetwork={
            error && error instanceof UnsupportedChainIdError
          }
          address={account}
          glow={!!pendingTransactions.length}
          setTransactionsTabOpen={() => setTransactionsTabIsOpen(true)}
          setShowWalletList={setShowWalletList}
        />
        <StyledSettingsButton
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          transactionsTabOpen={transactionsTabIsOpen}
        />
        <StyledMenuButton
          onClick={onMobileMenuButtonClick}
          ariaLabel={t("common.select")}
          icon="menu"
          iconSize={1.5625}
        />
      </TopBar>
      <TransactionsTab
        address={account!}
        chainId={chainId!}
        open={transactionsTabIsOpen}
        setTransactionsTabOpen={setTransactionsTabIsOpen}
        onDisconnectWalletClicked={() => {
          clearLastAccount();
          deactivate();
          if (connector instanceof WalletConnectConnector) {
            connector.close();
          }
          setTransactionsTabIsOpen(false);
        }}
        transactions={transactions}
        tokens={allTokens}
        balances={balances!}
        isUnsupportedNetwork={error && error instanceof UnsupportedChainIdError}
      />
    </>
  );
};
