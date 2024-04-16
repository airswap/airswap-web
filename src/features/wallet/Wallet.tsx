import React, { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Web3Provider } from "@ethersproject/providers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

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
import { ClearOrderType } from "../../types/clearOrderType";
import { selectBalances } from "../balances/balancesSlice";
import { fetchAllTokens, fetchProtocolFee } from "../metadata/metadataActions";
import {
  selectMetaDataReducer,
  selectProtocolFee,
} from "../metadata/metadataSlice";
import { fetchSupportedTokens } from "../registry/registryActions";
import {
  selectFilteredTransactions,
  selectPendingTransactions,
  setFilter,
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
  const balances = useAppSelector(selectBalances);
  const { providerName } = useAppSelector(selectWallet);
  const transactions = useAppSelector(selectFilteredTransactions);
  const pendingTransactions = useAppSelector(selectPendingTransactions);
  const protocolFee = useAppSelector(selectProtocolFee);
  const { isFetchingAllTokens } = useAppSelector(selectMetaDataReducer);

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

  const handleClearTransactionsChange = (type: ClearOrderType) => {
    dispatch(setFilter(type));
  };

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
      ]);
    } else if (!active) {
      dispatch(setWalletDisconnected());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, active]);

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
        account={account!}
        chainId={chainId!}
        open={transactionsTabIsOpen}
        protocolFee={protocolFee}
        setTransactionsTabOpen={setTransactionsTabIsOpen}
        onClearTransactionsChange={handleClearTransactionsChange}
        onDisconnectWalletClicked={() => {
          clearLastAccount();
          deactivate();
          if (connector instanceof WalletConnectConnector) {
            connector.close();
          }
          setTransactionsTabIsOpen(false);
        }}
        transactions={transactions}
        balances={balances!}
        isUnsupportedNetwork={error && error instanceof UnsupportedChainIdError}
      />
    </>
  );
};
