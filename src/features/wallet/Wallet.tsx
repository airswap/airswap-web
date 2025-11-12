import { FC, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import TransactionsTab from "../../components/TransactionsTab/TransactionsTab";
import { InterfaceContext } from "../../contexts/interface/Interface";
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
  const transactions = useAppSelector(selectFilteredTransactions);
  const pendingTransactions = useAppSelector(selectPendingTransactions);
  const protocolFee = useAppSelector(selectProtocolFee);

  // Interface context
  const {
    transactionsTabMenu,
    transactionsTabIsOpen,
    setShowWalletList,
    setTransactionsTabIsOpen,
    setTransactionsTabMenu,
  } = useContext(InterfaceContext);

  // Local component state
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [chainsOpen, setChainsOpen] = useState<boolean>(false);

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
      </TopBar>
      <TransactionsTab
        account={account!}
        activeTab={transactionsTabMenu}
        chainId={chainId!}
        // open={transactionsTabIsOpen}
        open={true}
        protocolFee={protocolFee}
        setTransactionsTabOpen={setTransactionsTabIsOpen}
        setTransactionsTabMenu={setTransactionsTabMenu}
        onClearTransactionsChange={handleClearTransactionsChange}
        onConnectButtonClick={handleConnectWalletClicked}
        onDisconnectButtonClick={handleDisconnectWalletClicked}
        onMobileMenuButtonClick={onMobileMenuButtonClick}
        transactions={transactions}
      />
    </>
  );
};
