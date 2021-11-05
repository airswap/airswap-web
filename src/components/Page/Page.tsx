import { FC, ReactElement, useState } from "react";

import InformationModals, {
  InformationType,
} from "../InformationModals/InformationModals";
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

  const [transactionsOpen, setTransactionsOpen] = useState<boolean>(false);

  const onToolbarButtonClick = (type: InformationType) => {
    setActiveModalPage(type);
  };

  const onCloseModalClick = () => {
    setActiveModalPage(null);
  };

  return (
    <StyledPage>
      <Toaster />
      <Toolbar onButtonClick={onToolbarButtonClick} />
      <StyledWallet
        showTransactions={transactionsOpen}
        setShowTransactions={setTransactionsOpen}
      />
      <WidgetFrame>
        <SwapWidget
          onTrackTransactionClicked={() => setTransactionsOpen(true)}
        />
      </WidgetFrame>
      <InformationModals
        onCloseModalClick={onCloseModalClick}
        activeModal={activeModalPage}
      />
    </StyledPage>
  );
};

export default Page;
