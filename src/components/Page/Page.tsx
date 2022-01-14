import { FC, ReactElement, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { InformationModalType } from "../InformationModals/InformationModals";
import SwapWidget from "../SwapWidget/SwapWidget";
import Toaster from "../Toasts/Toaster";
import Toolbar from "../Toolbar/Toolbar";
import WidgetFrame from "../WidgetFrame/WidgetFrame";
import {
  InnerContainer,
  StyledPage,
  StyledSocialButtons,
  StyledWallet,
  TopBar,
} from "./Page.styles";

const Page: FC<{ excludeWallet?: boolean }> = ({
  excludeWallet,
}): ReactElement => {
  const { active: web3ProviderIsActive } = useWeb3React<Web3Provider>();
  const [
    activeInformationModal,
    setActiveInformationModal,
  ] = useState<InformationModalType | null>(null);
  const [transactionsTabOpen, setTransactionsTabOpen] = useState<boolean>(
    false
  );
  const [showWalletList, setShowWalletList] = useState<boolean>(false);

  const onToolbarButtonClick = (type: InformationModalType) => {
    setActiveInformationModal(type);
  };

  return (
    <StyledPage>
      <InnerContainer>
        <Toaster open={transactionsTabOpen} />
        <Toolbar onButtonClick={onToolbarButtonClick} />

        <TopBar>
          <StyledWallet
            transactionsTabOpen={transactionsTabOpen}
            setTransactionsTabOpen={setTransactionsTabOpen}
            setShowWalletList={setShowWalletList}
          />
        </TopBar>

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
