import React, { FC, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import TransactionsTab from "../../components/TransactionsTab/TransactionsTab";
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
import { getConnection } from "../../web3-connectors/connections";
import { tryDeactivateConnector } from "../../web3-connectors/helpers";
import { selectBalances } from "../balances/balancesSlice";
// import { fetchAllTokens, fetchProtocolFee } from "../metadata/metadataActions";
import {
  selectMetaDataReducer,
  selectProtocolFee,
} from "../metadata/metadataSlice";
// import { fetchSupportedTokens } from "../registry/registryActions";
import {
  selectFilteredTransactions,
  selectPendingTransactions,
  setFilter,
} from "../transactions/transactionsSlice";
import { clearLastProviderFromLocalStorage } from "../web3/web3Api";

interface WalletProps {
  onAirswapButtonClick: () => void;
  onMobileMenuButtonClick: () => void;
}

export const Wallet: FC<WalletProps> = ({
  onAirswapButtonClick,
  onMobileMenuButtonClick,
}) => {
  const { t } = useTranslation();
  const {
    chainId,
    account,
    isActive,
    provider: library,
  } = useWeb3React<Web3Provider>();
  const { isInitialized, showConnectModal, connectionType } = useAppSelector(
    (state) => state.web3
  );

  // Redux
  const dispatch = useAppDispatch();
  const balances = useAppSelector(selectBalances);
  const transactions = useAppSelector(selectFilteredTransactions);
  const pendingTransactions = useAppSelector(selectPendingTransactions);
  const protocolFee = useAppSelector(selectProtocolFee);
  const { isFetchingAllTokens } = useAppSelector(selectMetaDataReducer);

  // Interface context
  const { transactionsTabIsOpen, setShowWalletList, setTransactionsTabIsOpen } =
    useContext(InterfaceContext);

  // Local component state
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [chainsOpen, setChainsOpen] = useState<boolean>(false);

  const handleClearTransactionsChange = (type: ClearOrderType) => {
    dispatch(setFilter(type));
  };

  // Auto-activate if user has connected before on (first render)
  // useEffect(() => {
  //     const lastConnectedAccount = loadLastAccount();
  //     if (lastConnectedAccount?.address) {
  //         setIsActivating(true);
  //         const connector = lastConnectedAccount.provider.getConnector();
  //         setConnector(connector);
  //         setProvider(lastConnectedAccount.provider);
  //         activate(connector)
  //             .then(() => {
  //                 setActivated(true);
  //             })
  //             .finally(() => {
  //                 setIsActivating(false);
  //             });
  //     }
  // }, [activate, activated]);

  // Side effects for connecting a wallet from SwapWidget

  // useEffect(() => {
  //     if (providerName) {
  //         const provider = SUPPORTED_WALLET_PROVIDERS.find(
  //             (provider) => provider.name === providerName
  //         );
  //         setProvider(provider);
  //         setConnector(provider!.getConnector());
  //     }
  // }, [providerName]);

  // Trigger request for balances and allowances once account is connected
  // useEffect(() => {
  //     if (isActive && account && chainId && library && connector && provider) {
  //         // Dispatch a general action to indicate wallet has changed
  //         dispatch(
  //             setWalletConnected({
  //                 chainId,
  //                 address: account,
  //             })
  //         );
  //         dispatch(fetchProtocolFee({ chainId, provider: library }));
  //         saveLastAccount(account, provider);
  //         Promise.all([
  //             ...(!isFetchingAllTokens
  //                 ? [dispatch(fetchAllTokens(chainId) as any)]
  //                 : []),
  //             dispatch(
  //                 fetchSupportedTokens({
  //                     provider: library,
  //                 } as any)
  //             ),
  //         ]);
  //     } else if (!isActive) {
  //         dispatch(setWalletDisconnected());
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [account, chainId, isActive]);

  const handleDisconnectWalletClicked = () => {
    if (!connectionType) {
      return;
    }

    tryDeactivateConnector(getConnection(connectionType).connector);
    clearLastProviderFromLocalStorage();
  };

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
          isConnected={isActive}
          isUnsupportedNetwork={false}
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
        onDisconnectButtonClick={handleDisconnectWalletClicked}
        transactions={transactions}
        balances={balances!}
        isUnsupportedNetwork={false}
      />
    </>
  );
};
