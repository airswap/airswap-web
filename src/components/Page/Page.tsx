import React, { FC, ReactElement, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch } from "../../app/hooks";
import { WalletProvider } from "../../constants/supportedWalletProviders";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { resetOrders } from "../../features/orders/ordersSlice";
import useHistoricalTransactions from "../../features/transactions/useHistoricalTransactions";
import { Wallet } from "../../features/wallet/Wallet";
import { setActiveProvider } from "../../features/wallet/walletSlice";
import useAppRouteParams from "../../hooks/useAppRouteParams";
import { useKeyPress } from "../../hooks/useKeyPress";
import HelmetContainer from "../HelmetContainer/HelmetContainer";
import Overlay from "../Overlay/Overlay";
import { StyledWalletProviderList } from "../SwapWidget/SwapWidget.styles";
import Toaster from "../Toasts/Toaster";
import Toolbar from "../Toolbar/Toolbar";
import WidgetFrame from "../WidgetFrame/WidgetFrame";
import { InnerContainer, StyledPage, StyledSocialButtons } from "./Page.styles";

type PageProps = {
  className?: string;
};

const Page: FC<PageProps> = ({ children, className }): ReactElement => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const { activate, active: web3ProviderIsActive } =
    useWeb3React<Web3Provider>();
  const appRouteParams = useAppRouteParams();
  const {
    setIsConnecting,
    showMobileToolbar,
    showWalletList,
    transactionsTabIsOpen,
    pageHeight,
    setShowMobileToolbar,
    setShowWalletList,
  } = useContext(InterfaceContext);

  useHistoricalTransactions();

  useKeyPress(() => setShowMobileToolbar(false), ["Escape"]);

  const reset = () => {
    setShowMobileToolbar(false);
    dispatch(resetOrders());
  };

  const handleAirswapButtonClick = () => {
    history.push("/");
  };

  const handleCloseMobileToolbarButtonClick = () => {
    setShowMobileToolbar(false);
  };

  const handleOpenMobileToolbarButtonClick = () => {
    setShowMobileToolbar(true);
  };

  const handleProviderSelected = (provider: WalletProvider) => {
    dispatch(setActiveProvider(provider.name));
    setIsConnecting(true);
    activate(provider.getConnector()).finally(() => setIsConnecting(false));
  };

  const handleCloseWalletProviderList = () => {
    setShowWalletList(false);
  };

  useEffect(() => {
    if (appRouteParams.route === undefined) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appRouteParams.route]);

  useEffect(() => {
    if (showMobileToolbar) {
      setShowMobileToolbar(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledPage style={{ height: `${pageHeight}px` }} className={className}>
      <HelmetContainer title={t("app.title")} />
      <InnerContainer>
        <Toaster open={transactionsTabIsOpen} />
        <Toolbar
          isHiddenOnMobile={!showMobileToolbar}
          onAirswapButtonClick={handleAirswapButtonClick}
          onMobileCloseButtonClick={handleCloseMobileToolbarButtonClick}
        />
        <Wallet
          onAirswapButtonClick={handleAirswapButtonClick}
          onMobileMenuButtonClick={handleOpenMobileToolbarButtonClick}
        />

        <WidgetFrame
          isOpen={transactionsTabIsOpen}
          isConnected={web3ProviderIsActive}
        >
          {children}

          <Overlay
            title={t("wallet.selectWallet")}
            onCloseButtonClick={handleCloseWalletProviderList}
            isHidden={!showWalletList}
          >
            <StyledWalletProviderList
              onClose={handleCloseWalletProviderList}
              onProviderSelected={handleProviderSelected}
            />
          </Overlay>
        </WidgetFrame>
        <StyledSocialButtons />
      </InnerContainer>
    </StyledPage>
  );
};

export default Page;
