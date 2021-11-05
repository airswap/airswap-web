import React, { FC, ReactElement, useState } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectUserSettings } from "../../features/userSettings/userSettingsSlice";
import useWindowSize from "../../helpers/useWindowSize";
import InformationModals, {
  InformationType,
} from "../InformationModals/InformationModals";
import SwapWidget from "../SwapWidget/SwapWidget";
import Toaster from "../Toasts/Toaster";
import Toolbar from "../Toolbar/Toolbar";
import WidgetFrame from "../WidgetFrame/WidgetFrame";
import { StyledPage, StyledWallet } from "./Page.styles";

export type StyledPageProps = {
  /**
   * if set, take off the space needed for the bookmarkwarning from the min-height and height of StyledPage
   */
  adjustForBookmarkWarning: boolean;
};

const Page: FC = (): ReactElement => {
  const [
    activeModalPage,
    setActiveModalPage,
  ] = useState<InformationType | null>(null);

  const [transactionsOpen, setTransactionsOpen] = useState<boolean>(false);

  const { showBookmarkWarning } = useAppSelector(selectUserSettings);
  const { width } = useWindowSize();
  /* using 480 from breakpoint size defined at src/style/breakpoints.ts */
  const adjustForBookmarkWarning = width! > 480 && showBookmarkWarning;

  const onToolbarButtonClick = (type: InformationType) => {
    setActiveModalPage(type);
  };

  const onCloseModalClick = () => {
    setActiveModalPage(null);
  };

  return (
    <StyledPage adjustForBookmarkWarning={adjustForBookmarkWarning}>
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
