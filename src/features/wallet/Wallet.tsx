import { FC, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import TransactionsTab from "../../components/TransactionsTab/TransactionsTab";
import { InterfaceContext } from "../../contexts/interface/Interface";
import useNetworkSupported from "../../hooks/useNetworkSupported";
import {
  AirswapButtonAndNavigationContainer,
  StyledAirswapButton,
  StyledAirswapFullButton,
  StyledChainSelector,
  StyledMenuButton,
  StyledSettingsButton,
  StyledSiteNavigation,
  StyledWalletButton,
  TopBar,
} from "../../styled-components/TopBar/Topbar";
import { ClearOrderType } from "../../types/clearOrderType";
import { getConnection } from "../../web3-connectors/connections";
import { tryDeactivateConnector } from "../../web3-connectors/helpers";
import { selectBalances } from "../balances/balancesSlice";
import { selectProtocolFee } from "../metadata/metadataSlice";
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
  const { isActive, account, chainId, connectionType } = useAppSelector(
    (state) => state.web3
  );

  // Redux
  const dispatch = useAppDispatch();
  const balances = useAppSelector(selectBalances);
  const transactions = useAppSelector(selectFilteredTransactions);
  const pendingTransactions = useAppSelector(selectPendingTransactions);
  const protocolFee = useAppSelector(selectProtocolFee);

  // Interface context
  const { transactionsTabIsOpen, setShowWalletList, setTransactionsTabIsOpen } =
    useContext(InterfaceContext);

  // Local component state
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [chainsOpen, setChainsOpen] = useState<boolean>(false);

  const isSupportedNetwork = useNetworkSupported();

  const handleClearTransactionsChange = (type: ClearOrderType) => {
    dispatch(setFilter(type));
  };

  const handleDisconnectWalletClicked = () => {
    if (!connectionType) {
      return;
    }

    tryDeactivateConnector(getConnection(connectionType).connector);
    clearLastProviderFromLocalStorage();
  };

  const handleConnectWalletClicked = () => {
    setShowWalletList(true);
  };

  return (
    <>
      <TopBar>
        <AirswapButtonAndNavigationContainer>
          <StyledAirswapButton
            onClick={onAirswapButtonClick}
            ariaLabel={t("common.AirSwap")}
            icon="airswap"
            iconSize={2}
          />
          <StyledAirswapFullButton
            onClick={onAirswapButtonClick}
            ariaLabel={t("common.AirSwap")}
            icon="airswap-full"
            iconSize={2}
          />
          <StyledSiteNavigation />
        </AirswapButtonAndNavigationContainer>
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
        onConnectButtonClick={handleConnectWalletClicked}
        onDisconnectButtonClick={handleDisconnectWalletClicked}
        transactions={transactions}
        balances={balances!}
        isUnsupportedNetwork={!isSupportedNetwork}
      />
    </>
  );
};
