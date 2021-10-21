import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAppSelector } from "../../app/hooks";
import { Orders } from "../../features/orders/Orders";
import { selectUserSettings } from "../../features/userSettings/userSettingsSlice";
import useWindowSize from "../../helpers/useWindowSize";
import InformationModals, {
  InformationType,
} from "../InformationModals/InformationModals";
import Toaster from "../Toasts/Toaster";
import Toolbar from "../Toolbar/Toolbar";
import TransactionsTab from "../TransactionsTab/TransactionsTab";
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
  const { showBookmarkWarning } = useAppSelector(selectUserSettings);
  const { width } = useWindowSize();
  /* using 480 from breakpoint size defined at src/style/breakpoints.ts */
  const adjustForBookmarkWarning = width! > 480 && showBookmarkWarning;
  const [transactionsTabOpen, setTransactionsTabOpen] = useState<boolean>(
    false
  );

  const handleEscKey = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        setTransactionsTabOpen(false);
      }
    },
    [setTransactionsTabOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscKey, false);

    return () => {
      document.removeEventListener("keydown", handleEscKey, false);
    };
  }, [handleEscKey]);

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
        setTransactionsTabOpen={() =>
          setTransactionsTabOpen(!transactionsTabOpen)
        }
      />
      <WidgetFrame>
        <Orders />
      </WidgetFrame>
      <InformationModals
        onCloseModalClick={onCloseModalClick}
        activeModal={activeModalPage}
      />
      <TransactionsTab open={transactionsTabOpen} />
    </StyledPage>
  );
};

export default Page;
