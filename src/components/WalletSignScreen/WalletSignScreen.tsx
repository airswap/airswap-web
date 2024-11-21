import { FC, ReactElement } from "react";

import i18n from "i18next";

import {
  OverlayContainer,
  OverlayLoader,
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
      <OverlayLoader />
      <OverlayTitle type="h2">{i18n.t("orders.pendingWallet")}</OverlayTitle>
      <OverlaySubHeading>{getDescription(type)}</OverlaySubHeading>
    </OverlayContainer>
  );
};

const getDescription = (type: WalletSignScreenType) => {
  if (type === "approve") {
    return i18n.t("orders.pendingApproval");
  }
  if (type === "deposit") {
    return i18n.t("orders.pendingDeposit");
  }
  if (type === "swap") {
    return i18n.t("orders.pendingConfirmation");
  }
  if (type === "cancel") {
    return i18n.t("orders.pendingCancellation");
  }
  return i18n.t("orders.pendingSignature");
};

export default WalletSignScreen;
