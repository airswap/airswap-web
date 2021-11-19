import { FC, ReactElement, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { InformationModalType } from "../InformationModals/InformationModals";
import SocialButtons from "../SocialButtons/SocialButtons";
import SwapWidget from "../SwapWidget/SwapWidget";
import TemporaryMobileLanding from "../TemporaryMobileLanding/TemporaryMobileLanding";
import Toaster from "../Toasts/Toaster";
import Toolbar from "../Toolbar/Toolbar";
import WidgetFrame from "../WidgetFrame/WidgetFrame";
import { StyledPage, StyledWallet } from "./Page.styles";

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
    <>
      <StyledPage>
        <Toaster open={transactionsTabOpen} />
        <Toolbar onButtonClick={onToolbarButtonClick} />
        <StyledWallet
          transactionsTabOpen={transactionsTabOpen}
          setTransactionsTabOpen={setTransactionsTabOpen}
          setShowWalletList={setShowWalletList}
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
        <SocialButtons />
      </StyledPage>
      <TemporaryMobileLanding />
    </>
  );
};

export default Page;
