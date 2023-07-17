import React, { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import { Title } from "../Typography/Typography";
import { Container, StyledWidgetHeader, Text } from "./WalletSignScreen.styles";

interface WalletConfirmScreenProps {
  className?: string;
}

const WalletSignScreen: FC<WalletConfirmScreenProps> = ({
  className = "",
}): ReactElement => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <StyledWidgetHeader>
        <Title type="h2" as="h1">
          {t("wallet.signInWallet")}
        </Title>
      </StyledWidgetHeader>
      <Text>{t("wallet.ifYourWalletDoesNotOpenSomethingWentWrong")}</Text>
    </Container>
  );
};

export default WalletSignScreen;
