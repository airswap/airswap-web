import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import i18n from "i18next";

import { useAppDispatch } from "../../app/hooks";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { resetOrders } from "../../features/orders/ordersSlice";
import useHistoricalTransactions from "../../features/transactions/useHistoricalTransactions";
import { Wallet } from "../../features/wallet/Wallet";
import useAppRouteParams from "../../hooks/useAppRouteParams";
import useDebounce from "../../hooks/useDebounce";
import useWindowSize from "../../hooks/useWindowSize";
import { AppRoutes } from "../../routes";
import HelmetContainer from "../HelmetContainer/HelmetContainer";
import { InformationModalType } from "../InformationModals/InformationModals";
import JoinModal from "../InformationModals/subcomponents/JoinModal/JoinModal";
import Overlay from "../Overlay/Overlay";
import Toaster from "../Toasts/Toaster";
import Toolbar from "../Toolbar/Toolbar";
import WidgetFrame from "../WidgetFrame/WidgetFrame";
import { InnerContainer, StyledPage, StyledSocialButtons } from "./Page.styles";
import { getInformationModalFromRoute } from "./helpers";

type PageProps = {
  className?: string;
};

const Page: FC<PageProps> = ({ children, className }): ReactElement => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  useHistoricalTransactions();
  const { t } = useTranslation();
  const { height: windowHeight } = useWindowSize();
  const { active: web3ProviderIsActive } = useWeb3React<Web3Provider>();
  const appRouteParams = useAppRouteParams();
  const {
    showMobileToolbar,
    transactionsTabIsOpen,
    setShowMobileToolbar,
    setShowWalletList,
    setTransactionsTabIsOpen,
  } = useContext(InterfaceContext);

  const [activeInformationModal, setActiveInformationModal] = useState<
    InformationModalType | undefined
  >(getInformationModalFromRoute(appRouteParams.route));
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
    i18n.changeLanguage(appRouteParams.lang);
  }, [appRouteParams.lang]);

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
          onLinkButtonClick={handleLinkButtonClick}
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
          <Overlay
            title={t("information.join.title")}
            onCloseButtonClick={handleInformationModalCloseButtonClick}
            isHidden={activeInformationModal !== AppRoutes.join}
          >
            <JoinModal />
          </Overlay>
        </WidgetFrame>
        <StyledSocialButtons />
      </InnerContainer>
    </StyledPage>
  );
};

export default Page;
