import { FC, ReactElement, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch } from "../../app/hooks";
import { resetOrders } from "../../features/orders/ordersSlice";
import { InformationModalType } from "../InformationModals/InformationModals";
import SwapWidget from "../SwapWidget/SwapWidget";
import Toaster from "../Toasts/Toaster";
import Toolbar from "../Toolbar/Toolbar";
import TopBar from "../TopBar/TopBar";
import WidgetFrame from "../WidgetFrame/WidgetFrame";
import { InnerContainer, StyledPage, StyledSocialButtons } from "./Page.styles";

const Page: FC<{ excludeWallet?: boolean }> = ({
  excludeWallet,
}): ReactElement => {
  const dispatch = useAppDispatch();
  const { active: web3ProviderIsActive } = useWeb3React<Web3Provider>();
  const [
    activeInformationModal,
    setActiveInformationModal,
  ] = useState<InformationModalType | null>(null);
  const [transactionsTabOpen, setTransactionsTabOpen] = useState<boolean>(
    false
  );
  const [showWalletList, setShowWalletList] = useState<boolean>(false);

  const onLinkButtonClick = (type: InformationModalType) => {
    setActiveInformationModal(type);
  };

  const onAirswapButtonClick = () => {
    dispatch(resetOrders());
  };

  return (
    <StyledPage>
      <InnerContainer>
        <Toaster open={transactionsTabOpen} />
        <Toolbar
          onLinkButtonClick={onLinkButtonClick}
          onAirswapButtonClick={onAirswapButtonClick}
        />
        <TopBar
          transactionsTabOpen={transactionsTabOpen}
          setTransactionsTabOpen={setTransactionsTabOpen}
          setShowWalletList={setShowWalletList}
          onAirswapButtonClick={onAirswapButtonClick}
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
            afterInformationModalClose={() => setActiveInformationModal(null)}
            transactionsTabOpen={transactionsTabOpen}
          />
        </WidgetFrame>
        <StyledSocialButtons />
      </InnerContainer>
    </StyledPage>
  );
};

export default Page;
