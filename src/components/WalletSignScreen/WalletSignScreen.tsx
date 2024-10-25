import { FC, ReactElement } from "react";

import i18n from "i18next";

import {
  Container,
  Loader,
  StyledTitle,
  StyledWidgetHeader,
  Text,
} from "./WalletSignScreen.styles";

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
    <Container className={className}>
      <Loader />
      <StyledWidgetHeader>
        <StyledTitle type="h2">{getTitle(type)}</StyledTitle>
      </StyledWidgetHeader>
      <Text>{getDescription(type)}</Text>
    </Container>
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
