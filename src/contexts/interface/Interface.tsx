import React, { Dispatch, FC, useEffect, useState } from "react";

import useDebounce from "../../hooks/useDebounce";
import useWindowSize from "../../hooks/useWindowSize";

export interface InterfaceContextContextProps {
  isConnecting: boolean;
  isDebugMode: boolean;
  showMobileToolbar: boolean;
  showWalletList: boolean;
  transactionsTabIsOpen: boolean;

  pageHeight?: number;

  setIsConnecting: Dispatch<React.SetStateAction<boolean>>;
  setIsDebugMode: Dispatch<React.SetStateAction<boolean>>;
  setShowMobileToolbar: Dispatch<React.SetStateAction<boolean>>;
  setShowWalletList: Dispatch<React.SetStateAction<boolean>>;
  setTransactionsTabIsOpen: Dispatch<React.SetStateAction<boolean>>;
}

export const InterfaceContext =
  React.createContext<InterfaceContextContextProps>({
    isConnecting: false,
    isDebugMode: false,
    showWalletList: false,
    showMobileToolbar: false,
    transactionsTabIsOpen: false,
    setIsConnecting: () => {},
    setIsDebugMode: () => {},
    setShowMobileToolbar: () => {},
    setShowWalletList: () => {},
    setTransactionsTabIsOpen: () => {},
  });

const InterfaceProvider: FC = ({ children }) => {
  const { height: windowHeight } = useWindowSize();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [showMobileToolbar, setShowMobileToolbar] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);
  const [transactionsTabIsOpen, setTransactionsTabIsOpen] = useState(false);
  const [pageHeight, setPageHeight] = useState(windowHeight);

  useDebounce(
    () => {
      setPageHeight(windowHeight);
    },
    100,
    [windowHeight]
  );

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
        isConnecting,
        isDebugMode,
        showMobileToolbar,
        showWalletList,
        transactionsTabIsOpen,
        pageHeight,
        setIsConnecting,
        setIsDebugMode,
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
