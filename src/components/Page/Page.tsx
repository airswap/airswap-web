import React, { FC, ReactElement, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../../app/hooks";
import { Orders } from "../../features/orders/Orders";
import { selectUserSettings } from "../../features/userSettings/userSettingsSlice";
import useWindowSize from "../../helpers/useWindowSize";
import InformationModals, {
  InformationType,
} from "../InformationModals/InformationModals";
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

  const { active, library, error } = useWeb3React<Web3Provider>();
  const isUnsupportedChain = error && error instanceof UnsupportedChainIdError;

  return (
    <StyledPage adjustForBookmarkWarning={adjustForBookmarkWarning}>
      <Toaster />
      <Toolbar onButtonClick={onToolbarButtonClick} />
      <StyledWallet />
      <WidgetFrame>
        <Orders />
      </WidgetFrame>
      <InformationModals
        onCloseModalClick={onCloseModalClick}
        activeModal={activeModalPage}
      />
      {active && (
        <div>
          <span>
            {isUnsupportedChain
              ? "unsupoprted chain"
              : "this chain is supported"}
          </span>
          <button
            onClick={() => {
              if (!!library?.provider?.request) {
                library?.provider?.request({
                  method: "wallet_switchEthereumChain",
                  params: [
                    {
                      chainId: "0x1",
                    },
                  ],
                });
              }
            }}
          >
            Switch network
          </button>
        </div>
      )}
    </StyledPage>
  );
};

export default Page;
