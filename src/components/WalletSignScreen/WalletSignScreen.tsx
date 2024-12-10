import { FC, ReactElement } from "react";

import i18n from "i18next";

import {
  OverlayContainer,
  OverlaySpinningLoader,
  OverlaySubHeading,
  OverlayTitle,
} from "../../styled-components/Overlay/Overlay";

type WalletSignScreenType =
  | "approve"
  | "deposit"
  | "signature"
  | "swap"
  | "cancel";

interface WalletConfirmScreenProps {
  type?: WalletSignScreenType;
  className?: string;
}

const WalletSignScreen: FC<WalletConfirmScreenProps> = ({
  type = "approve",
  className = "",
}): ReactElement => {
  return (
    <OverlayContainer className={className}>
      <OverlaySpinningLoader />
      <OverlayTitle type="h2">{i18n.t("orders.pendingWallet")}</OverlayTitle>
      <OverlaySubHeading>
        {i18n.t("orders.pendingConfirmation")}
      </OverlaySubHeading>
    </OverlayContainer>
  );
};

export default WalletSignScreen;
