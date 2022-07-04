import React, { Dispatch, FC, useEffect, useState } from "react";

import i18n from "i18next";

import { InformationModalType } from "../../components/InformationModals/InformationModals";
import { getInformationModalFromRoute } from "../../components/Page/helpers";
import useAppRouteParams from "../../hooks/useAppRouteParams";
import useDebounce from "../../hooks/useDebounce";
import useWindowSize from "../../hooks/useWindowSize";

export interface InterfaceContextContextProps {
  showMobileToolbar: boolean;
  showWalletList: boolean;
  transactionsTabIsOpen: boolean;

  activeInformationModal?: InformationModalType;
  pageHeight?: number;

  setActiveInformationModal: Dispatch<
    React.SetStateAction<InformationModalType | undefined>
  >;
  setShowMobileToolbar: Dispatch<React.SetStateAction<boolean>>;
  setShowWalletList: Dispatch<React.SetStateAction<boolean>>;
  setTransactionsTabIsOpen: Dispatch<React.SetStateAction<boolean>>;
}

export const InterfaceContext =
  React.createContext<InterfaceContextContextProps>({
    showWalletList: false,
    showMobileToolbar: false,
    transactionsTabIsOpen: false,
    setActiveInformationModal: () => {},
    setShowMobileToolbar: () => {},
    setShowWalletList: () => {},
    setTransactionsTabIsOpen: () => {},
  });

const InterfaceProvider: FC = ({ children }) => {
  const appRouteParams = useAppRouteParams();
  const { height: windowHeight } = useWindowSize();

  const [showMobileToolbar, setShowMobileToolbar] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);
  const [transactionsTabIsOpen, setTransactionsTabIsOpen] = useState(false);
  const [pageHeight, setPageHeight] = useState(windowHeight);
  const [activeInformationModal, setActiveInformationModal] = useState<
    InformationModalType | undefined
  >(getInformationModalFromRoute(appRouteParams.route));

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

  return (
    <InterfaceContext.Provider
      value={{
        showMobileToolbar,
        showWalletList,
        transactionsTabIsOpen,
        activeInformationModal,
        pageHeight,
        setActiveInformationModal,
        setShowMobileToolbar,
        setShowWalletList,
        setTransactionsTabIsOpen,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
};

export default InterfaceProvider;
