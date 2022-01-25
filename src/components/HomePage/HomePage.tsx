import React, { FC, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { InformationModalType } from "../InformationModals/InformationModals";
import Page from "../Page/Page";
import SwapWidget from "../SwapWidget/SwapWidget";
import WidgetFrame from "../WidgetFrame/WidgetFrame";

const HomePage: FC = () => {
  const [transactionsTabOpen, setTransactionsTabOpen] = useState<boolean>(
    false
  );
  const { active: web3ProviderIsActive } = useWeb3React<Web3Provider>();
  const [showWalletList, setShowWalletList] = useState<boolean>(false);
  const [
    activeInformationModal,
    setActiveInformationModal,
  ] = useState<InformationModalType | null>(null);

  return (
    <>
      <Page>
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
      </Page>
    </>
  );
};

export default HomePage;
