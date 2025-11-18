import React, { Dispatch, FC, useEffect, useState } from "react";

import useAppRouteParams from "../../hooks/useAppRouteParams";
import useDebounce from "../../hooks/useDebounce";
import useWindowSize from "../../hooks/useWindowSize";

export type TransactionsTabMenu = "myActivity" | "myOrders";
export interface InterfaceContextContextProps {
  isConnecting: boolean;
  isDebugMode: boolean;
  showModalOverlay: boolean;
  showTransactionOverlay: boolean;
  showMobileToolbar: boolean;
  showWalletList: boolean;
  transactionsTabIsOpen: boolean;
  transactionsTabMenu: TransactionsTabMenu;

  pageHeight?: number;
  overlayHeight?: number;

  resize: () => void;
  setIsConnecting: Dispatch<React.SetStateAction<boolean>>;
  setIsDebugMode: Dispatch<React.SetStateAction<boolean>>;
  setShowMobileToolbar: Dispatch<React.SetStateAction<boolean>>;
  setShowModalOverlay: Dispatch<React.SetStateAction<boolean>>;
  setShowTransactionOverlay: Dispatch<React.SetStateAction<boolean>>;
  setShowWalletList: Dispatch<React.SetStateAction<boolean>>;
  setTransactionsTabIsOpen: Dispatch<React.SetStateAction<boolean>>;
  setTransactionsTabMenu: Dispatch<React.SetStateAction<TransactionsTabMenu>>;
  setOverlayHeight: Dispatch<React.SetStateAction<number>>;
}

export const InterfaceContext =
  React.createContext<InterfaceContextContextProps>({
    isConnecting: false,
    isDebugMode: false,
    showMobileToolbar: false,
    showModalOverlay: false,
    showTransactionOverlay: false,
    showWalletList: false,
    transactionsTabIsOpen: false,
    transactionsTabMenu: "myActivity",
    resize: () => {},
    setIsConnecting: () => {},
    setIsDebugMode: () => {},
    setShowMobileToolbar: () => {},
    setShowModalOverlay: () => {},
    setShowTransactionOverlay: () => {},
    setShowWalletList: () => {},
    setTransactionsTabIsOpen: () => {},
    setTransactionsTabMenu: () => {},
    setOverlayHeight: () => {},
  });

const InterfaceProvider: FC = ({ children }) => {
  const { height: windowHeight } = useWindowSize();
  const appRouteParams = useAppRouteParams();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [showMobileToolbar, setShowMobileToolbar] = useState(false);
  const [showModalOverlay, setShowModalOverlay] = useState(false);
  const [showTransactionOverlay, setShowTransactionOverlay] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);
  const [transactionsTabIsOpen, setTransactionsTabIsOpen] = useState(false);
  const [transactionsTabMenu, setTransactionsTabMenu] =
    useState<TransactionsTabMenu>("myActivity");
  const [pageHeight, setPageHeight] = useState(windowHeight);
  const [overlayHeight, setOverlayHeight] = useState(0);

  const calculateAndSetPageHeight = () => {
    const widgetFrameWrapper = document.getElementById("widget-frame-wrapper");
    const widgetFrameWrapperHeight = widgetFrameWrapper?.clientHeight;

    setPageHeight(Math.max(windowHeight || 0, widgetFrameWrapperHeight || 0));
  };

  useDebounce(calculateAndSetPageHeight, 100, [windowHeight]);

  useEffect(() => {
    if (!showModalOverlay) {
      setOverlayHeight(0);
    }
  }, [showModalOverlay]);

  useEffect(() => {
    if (showMobileToolbar) {
      document.body.classList.add("scroll-locked");
    } else {
      document.body.classList.remove("scroll-locked");
    }
  }, [showMobileToolbar]);

  useEffect(() => {
    setShowTransactionOverlay(false);
    setTransactionsTabIsOpen(false);
    setShowModalOverlay(false);
    calculateAndSetPageHeight();
  }, [appRouteParams.route, appRouteParams.isLimitOrder]);

  return (
    <InterfaceContext.Provider
      value={{
        isConnecting,
        isDebugMode,
        showMobileToolbar,
        showModalOverlay,
        showTransactionOverlay,
        showWalletList,
        transactionsTabIsOpen,
        transactionsTabMenu,
        pageHeight,
        overlayHeight,
        resize: calculateAndSetPageHeight,
        setIsConnecting,
        setIsDebugMode,
        setShowMobileToolbar,
        setShowModalOverlay,
        setShowTransactionOverlay,
        setShowWalletList,
        setTransactionsTabIsOpen,
        setTransactionsTabMenu,
        setOverlayHeight,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
};

export default InterfaceProvider;
