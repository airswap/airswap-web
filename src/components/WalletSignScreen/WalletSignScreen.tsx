import { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import i18n from "i18next";

import {
  OverlayContainer,
  OverlaySpinningLoader,
  OverlaySubHeading,
  OverlayTitle,
} from "../../styled-components/Overlay/Overlay";
import OverlayLoader from "../OverlayLoader/OverlayLoader";

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
  const { t } = useTranslation();

  const text =
    type === "signature"
      ? t("orders.pendingSignature")
      : t("orders.pendingConfirmation");

  return (
    <OverlayContainer className={className}>
      <OverlayLoader />
      <OverlayTitle type="h2">{i18n.t("orders.pendingWallet")}</OverlayTitle>
      <OverlaySubHeading>{text}</OverlaySubHeading>
    </OverlayContainer>
  );
};

export default WalletSignScreen;
