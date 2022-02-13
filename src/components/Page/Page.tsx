import { FC, ReactElement, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch } from "../../app/hooks";
import { resetOrders } from "../../features/orders/ordersSlice";
import { Wallet } from "../../features/wallet/Wallet";
import { AppRoutes } from "../../routes";
import { InformationModalType } from "../InformationModals/InformationModals";
import SwapWidget from "../SwapWidget/SwapWidget";
import Toaster from "../Toasts/Toaster";
import Toolbar from "../Toolbar/Toolbar";
import WidgetFrame from "../WidgetFrame/WidgetFrame";
import { InnerContainer, StyledPage, StyledSocialButtons } from "./Page.styles";

function getInformationModalFromLocation(
  location: string
): InformationModalType | undefined {
  switch (location) {
    case `/${AppRoutes.join}`:
      return AppRoutes.join;
    default:
      return undefined;
  }
}

const Page: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation().pathname;
  const lastLocation = useLastLocation();
  const { active: web3ProviderIsActive } = useWeb3React<Web3Provider>();

  const [activeInformationModal, setActiveInformationModal] = useState<
    InformationModalType | undefined
  >(getInformationModalFromLocation(location));
  const [transactionsTabOpen, setTransactionsTabOpen] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);
  const [showMobileToolbar, setShowMobileToolbar] = useState(false);

  const handleLinkButtonClick = (type: InformationModalType) => {
    history.push(`/${type}`);
  };

  const handleCloseMobileToolbarButtonClick = () => {
    setShowMobileToolbar(false);
  };

  const handleOpenMobileToolbarButtonClick = () => {
    setShowMobileToolbar(true);
  };

  const handleAirswapButtonClick = () => {
    history.push("");
    setActiveInformationModal(undefined);
    setShowMobileToolbar(false);
    dispatch(resetOrders());
  };

  const handleInformationModalCloseButtonClick = () => {
    // Check if user has a route before modal. If not then we can't use history.goBack
    // because the user would route away from the website
    if (lastLocation) {
      history.goBack();
    } else {
      history.push("");
    }
  };

  useEffect(() => {
    if (showMobileToolbar) {
      document.body.classList.add("scroll-locked");
    } else {
      document.body.classList.remove("scroll-locked");
    }
  }, [showMobileToolbar]);

  useEffect(() => {
    setActiveInformationModal(getInformationModalFromLocation(location));
  }, [location]);

  useEffect(() => {}, [location]);

  return (
    <StyledPage>
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
