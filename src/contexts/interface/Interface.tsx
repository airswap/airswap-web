import React, { Dispatch, FC, useState } from "react";

export interface InterfaceContextContextProps {
  showWalletList: boolean;
  transactionsTabIsOpen: boolean;
  setShowWalletList: Dispatch<React.SetStateAction<boolean>>;
  setTransactionsTabIsOpen: Dispatch<React.SetStateAction<boolean>>;
}

export const InterfaceContext =
  React.createContext<InterfaceContextContextProps>({
    showWalletList: false,
    transactionsTabIsOpen: false,
    setShowWalletList: () => {},
    setTransactionsTabIsOpen: () => {},
  });

const InterfaceProvider: FC = ({ children }) => {
  const [transactionsTabIsOpen, setTransactionsTabIsOpen] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);

  return (
    <InterfaceContext.Provider
      value={{
        transactionsTabIsOpen,
        showWalletList,
        setShowWalletList,
        setTransactionsTabIsOpen,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
};

export default InterfaceProvider;
