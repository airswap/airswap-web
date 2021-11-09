import { FC, ReactElement, useState } from "react";

import InformationModals, {
  InformationType,
} from "../InformationModals/InformationModals";
import SocialButtons from "../SocialButtons/SocialButtons";
import SwapWidget from "../SwapWidget/SwapWidget";
import Toaster from "../Toasts/Toaster";
import Toolbar from "../Toolbar/Toolbar";
import WidgetFrame from "../WidgetFrame/WidgetFrame";
import { StyledPage, StyledWallet } from "./Page.styles";

const Page: FC = (): ReactElement => {
  const [
    activeModalPage,
    setActiveModalPage,
  ] = useState<InformationType | null>(null);
  const [transactionsTabOpen, setTransactionsTabOpen] = useState<boolean>(
    false
  );
  const [showWalletList, setShowWalletList] = useState<boolean>(false);

  const onToolbarButtonClick = (type: InformationType) => {
    setActiveModalPage(type);
  };

  const onCloseModalClick = () => {
    setActiveModalPage(null);
  };

  return (
    <StyledPage>
      <Toaster open={transactionsTabOpen} />
      <Toolbar onButtonClick={onToolbarButtonClick} />
      <StyledWallet
        transactionsTabOpen={transactionsTabOpen}
        setTransactionsTabOpen={setTransactionsTabOpen}
        setShowWalletList={setShowWalletList}
      />
      <WidgetFrame>
        <SwapWidget
          showWalletList={showWalletList}
          setShowWalletList={setShowWalletList}
          onTrackTransactionClicked={() => setTransactionsTabOpen(true)}
        />
      </WidgetFrame>
      <SocialButtons />
      <InformationModals
        onCloseModalClick={onCloseModalClick}
        activeModal={activeModalPage}
      />
    </StyledPage>
  );
};

export default Page;
