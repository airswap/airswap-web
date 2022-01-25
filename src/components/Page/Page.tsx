import React, { FC, ReactElement, useState } from "react";

import { InformationModalType } from "../InformationModals/InformationModals";
import SocialButtons from "../SocialButtons/SocialButtons";
import TemporaryMobileLanding from "../TemporaryMobileLanding/TemporaryMobileLanding";
import Toaster from "../Toasts/Toaster";
import Toolbar from "../Toolbar/Toolbar";
import { StyledPage, StyledWallet } from "./Page.styles";

const Page: FC<{ excludeWallet?: boolean; children?: React.ReactNode }> = ({
  excludeWallet,
  children,
}): ReactElement => {
  const [
    activeInformationModal,
    setActiveInformationModal,
  ] = useState<InformationModalType | null>(null);
  const [transactionsTabOpen, setTransactionsTabOpen] = useState<boolean>(
    false
  );
  const [showWalletList, setShowWalletList] = useState<boolean>(false);

  const onToolbarButtonClick = (type: InformationModalType) => {
    setActiveInformationModal(type);
  };

  return (
    <>
      <StyledPage>
        <Toaster open={transactionsTabOpen} />
        <Toolbar onButtonClick={onToolbarButtonClick} />
        <StyledWallet
          transactionsTabOpen={transactionsTabOpen}
          setTransactionsTabOpen={setTransactionsTabOpen}
          setShowWalletList={setShowWalletList}
        />

        <div>{children}</div>

        <SocialButtons />
      </StyledPage>
      <TemporaryMobileLanding />
    </>
  );
};

export default Page;
