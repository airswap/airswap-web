import React, { FC, ReactElement, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch } from "../../app/hooks";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { resetOrders } from "../../features/orders/ordersSlice";
import useHistoricalTransactions from "../../features/transactions/useHistoricalTransactions";
import { Wallet } from "../../features/wallet/Wallet";
import useAppRouteParams from "../../hooks/useAppRouteParams";
import HelmetContainer from "../HelmetContainer/HelmetContainer";
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
  useHistoricalTransactions();
  const { t } = useTranslation();
  const { active: web3ProviderIsActive } = useWeb3React<Web3Provider>();
  const appRouteParams = useAppRouteParams();
  const {
    showMobileToolbar,
    transactionsTabIsOpen,
    pageHeight,
    setShowMobileToolbar,
    setShowWalletList,
    setTransactionsTabIsOpen,
  } = useContext(InterfaceContext);

  const reset = () => {
    setShowMobileToolbar(false);
    dispatch(resetOrders());
  };

  const handleAirswapButtonClick = () => {
    history.push(appRouteParams.justifiedBaseUrl);
  };

  const handleCloseMobileToolbarButtonClick = () => {
    setShowMobileToolbar(false);
  };

  const handleOpenMobileToolbarButtonClick = () => {
    setShowMobileToolbar(true);
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
          transactionsTabOpen={transactionsTabIsOpen}
          setTransactionsTabOpen={setTransactionsTabIsOpen}
          setShowWalletList={setShowWalletList}
          onAirswapButtonClick={handleAirswapButtonClick}
          onMobileMenuButtonClick={handleOpenMobileToolbarButtonClick}
        />
        <WidgetFrame
          isOpen={transactionsTabIsOpen}
          isConnected={web3ProviderIsActive}
        >
          {children}
        </WidgetFrame>
        <StyledSocialButtons />
      </InnerContainer>
    </StyledPage>
  );
};

export default Page;
