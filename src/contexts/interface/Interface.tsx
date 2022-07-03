import React, { Dispatch, FC, useState } from "react";

export interface InterfaceContextContextProps {
  showMobileToolbar: boolean;
  showWalletList: boolean;
  transactionsTabIsOpen: boolean;
  setShowMobileToolbar: Dispatch<React.SetStateAction<boolean>>;
  setShowWalletList: Dispatch<React.SetStateAction<boolean>>;
  setTransactionsTabIsOpen: Dispatch<React.SetStateAction<boolean>>;
}

export const InterfaceContext =
  React.createContext<InterfaceContextContextProps>({
    showWalletList: false,
    showMobileToolbar: false,
    transactionsTabIsOpen: false,
    setShowMobileToolbar: () => {},
    setShowWalletList: () => {},
    setTransactionsTabIsOpen: () => {},
  });

const InterfaceProvider: FC = ({ children }) => {
  const [showMobileToolbar, setShowMobileToolbar] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);
  const [transactionsTabIsOpen, setTransactionsTabIsOpen] = useState(false);

  return (
    <InterfaceContext.Provider
      value={{
        showMobileToolbar,
        showWalletList,
        transactionsTabIsOpen,
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
