import React, { FC, ReactElement, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { clear, setResetStatus } from "../../features/orders/ordersSlice";
import { Wallet } from "../../features/wallet/Wallet";
import useAppRouteParams from "../../hooks/useAppRouteParams";
import { useKeyPress } from "../../hooks/useKeyPress";
import WalletConnector from "../@widgets/WalletConnector/WalletConnector";
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
  const { t } = useTranslation();
  const { isActive: web3ProviderIsActive } = useAppSelector(
    (state) => state.web3
  );

  const appRouteParams = useAppRouteParams();
  const {
    showMobileToolbar,
    showOverlay,
    transactionsTabIsOpen,
    pageHeight,
    setShowMobileToolbar,
  } = useContext(InterfaceContext);

  useKeyPress(() => setShowMobileToolbar(false), ["Escape"]);

  const reset = () => {
    setShowMobileToolbar(false);
    dispatch(clear());
    dispatch(setResetStatus());
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

  useEffect(() => {
    if (appRouteParams.route === undefined) {
      reset();
    }
  }, [appRouteParams.route]);

  useEffect(() => {
    if (showMobileToolbar) {
      setShowMobileToolbar(false);
    }
  }, []);

  return (
    <StyledPage
      showOverlay={showOverlay}
      style={{ height: `${pageHeight}px` }}
      className={className}
    >
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
          isOverlayOpen={showOverlay}
        >
          {children}
          <WalletConnector />
        </WidgetFrame>
        <StyledSocialButtons />
      </InnerContainer>
    </StyledPage>
  );
};

export default Page;
