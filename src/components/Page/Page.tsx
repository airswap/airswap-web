import React, { FC, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch } from "../../app/hooks";
import { resetOrders } from "../../features/orders/ordersSlice";
import useHistoricalTransactions from "../../features/transactions/useHistoricalTransactions";
import { Wallet } from "../../features/wallet/Wallet";
import useAppRouteParams from "../../hooks/useAppRouteParams";
import useDebounce from "../../hooks/useDebounce";
import useWindowSize from "../../hooks/useWindowSize";
import { AppRoutes } from "../../routes";
import HelmetContainer from "../HelmetContainer/HelmetContainer";
import { InformationModalType } from "../InformationModals/InformationModals";
import SwapWidget from "../SwapWidget/SwapWidget";
import Toaster from "../Toasts/Toaster";
import Toolbar from "../Toolbar/Toolbar";
import WidgetFrame from "../WidgetFrame/WidgetFrame";
import { InnerContainer, StyledPage, StyledSocialButtons } from "./Page.styles";

function getInformationModalFromRoute(
  route: AppRoutes | undefined
): InformationModalType | undefined {
  switch (route) {
    case AppRoutes.join:
      return AppRoutes.join;
    default:
      return undefined;
  }
}

const Page: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  useHistoricalTransactions();
  const { t } = useTranslation();
  const { height: windowHeight } = useWindowSize();
  const { active: web3ProviderIsActive } = useWeb3React<Web3Provider>();

  const appRouteParams = useAppRouteParams();
  const [activeInformationModal, setActiveInformationModal] = useState<
    InformationModalType | undefined
  >(getInformationModalFromRoute(appRouteParams.route));
  const [transactionsTabOpen, setTransactionsTabOpen] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);
  const [showMobileToolbar, setShowMobileToolbar] = useState(false);
  const [pageHeight, setPageHeight] = useState(windowHeight);

  const reset = () => {
    setActiveInformationModal(undefined);
    setShowMobileToolbar(false);
    dispatch(resetOrders());
  };

  const handleLinkButtonClick = (type: InformationModalType) => {
    history.push(`/${type}`);
  };

  const handleAirswapButtonClick = () => {
    history.push(appRouteParams.justifiedBaseUrl);
  };

  const handleInformationModalCloseButtonClick = () => {
    history.push(appRouteParams.justifiedBaseUrl);
  };

  const handleCloseMobileToolbarButtonClick = () => {
    setShowMobileToolbar(false);
  };

  const handleOpenMobileToolbarButtonClick = () => {
    setShowMobileToolbar(true);
  };

  useDebounce(
    () => {
      setPageHeight(windowHeight);
    },
    100,
    [windowHeight]
  );

  useEffect(() => {
    if (showMobileToolbar) {
      document.body.classList.add("scroll-locked");
    } else {
      document.body.classList.remove("scroll-locked");
    }
  }, [showMobileToolbar]);

  useEffect(() => {
    setActiveInformationModal(
      getInformationModalFromRoute(appRouteParams.route)
    );

    if (appRouteParams.route === undefined) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appRouteParams.route]);

  return (
    <StyledPage style={{ height: `${pageHeight}px` }}>
      <HelmetContainer title={t("app.title")} />
      <InnerContainer>
        <Toaster open={transactionsTabOpen} />
        <Toolbar
          isHiddenOnMobile={!showMobileToolbar}
          onLinkButtonClick={handleLinkButtonClick}
          onAirswapButtonClick={handleAirswapButtonClick}
          onMobileCloseButtonClick={handleCloseMobileToolbarButtonClick}
        />
        <Wallet
          transactionsTabOpen={transactionsTabOpen}
          setTransactionsTabOpen={setTransactionsTabOpen}
          setShowWalletList={setShowWalletList}
          onAirswapButtonClick={handleAirswapButtonClick}
          onMobileMenuButtonClick={handleOpenMobileToolbarButtonClick}
        />
        <WidgetFrame
          isOpen={transactionsTabOpen}
          isConnected={web3ProviderIsActive}
        >
          <SwapWidget
            showWalletList={showWalletList}
            activeInformationModal={activeInformationModal}
            setShowWalletList={setShowWalletList}
            onTrackTransactionClicked={() => setTransactionsTabOpen(true)}
            onInformationModalCloseButtonClick={
              handleInformationModalCloseButtonClick
            }
            transactionsTabOpen={transactionsTabOpen}
          />
        </WidgetFrame>
        <StyledSocialButtons />
      </InnerContainer>
    </StyledPage>
  );
};

export default Page;
