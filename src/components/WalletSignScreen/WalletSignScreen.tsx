import { FC, ReactElement } from "react";

import i18n from "i18next";

import {
  OverlayContainer,
  OverlayLoader,
  OverlaySubHeading,
  OverlayTitle,
} from "../../styled-components/Overlay/Overlay";

type WalletSignScreenType = "approve" | "deposit" | "signature";

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
      <OverlayTitle type="h2">{getTitle(type)}</OverlayTitle>
      <OverlaySubHeading>{getDescription(type)}</OverlaySubHeading>
    </OverlayContainer>
  );
};

const getTitle = (type: WalletSignScreenType) => {
  if (type === "approve") {
    return i18n.t("orders.pendingApproval");
  }

  if (type === "deposit") {
    return i18n.t("orders.pendingDeposit");
  }

  return i18n.t("orders.pendingSignature");
};

const getDescription = (type: WalletSignScreenType) => {
  if (type === "approve") {
    return i18n.t("orders.approveTokenInYourWallet");
  }

  return i18n.t("orders.signTransactionInYourWallet");
};

export default WalletSignScreen;
