import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { getActionButtonTranslation } from "../../helpers";
import { BackButton, Container, SignButton } from "./ActionButtons.styles";

export enum ButtonActions {
  connectWallet,
  switchNetwork,
  reloadPage,
  restart,
  goBack,
  sign,
}

const buttonTextMapping: Record<ButtonActions, string> = {
  [ButtonActions.connectWallet]: "wallet.connectWallet",
  [ButtonActions.switchNetwork]: "wallet.switchNetwork",
  [ButtonActions.reloadPage]: "common.reloadPage",
  [ButtonActions.restart]: "orders.newSwap",
  [ButtonActions.goBack]: "common.back",
  [ButtonActions.sign]: "orders.sign",
};

type ActionButtonsProps = {
  hasInsufficientExpiry: boolean;
  hasInsufficientMakerTokenBalance: boolean;
  hasMissingMakerAmount: boolean;
  hasMissingMakerToken: boolean;
  hasMissingTakerAmount: boolean;
  hasMissingTakerToken: boolean;
  walletIsNotConnected: boolean;
  makerTokenSymbol?: string;
  onBackButtonClick: () => void;
  onSignButtonClick: () => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientExpiry,
  hasInsufficientMakerTokenBalance,
  hasMissingMakerAmount,
  hasMissingMakerToken,
  hasMissingTakerAmount,
  hasMissingTakerToken,
  walletIsNotConnected,
  makerTokenSymbol,
  onBackButtonClick,
  onSignButtonClick,
}) => {
  const { t } = useTranslation();

  const isDisabled =
    hasInsufficientExpiry ||
    hasInsufficientMakerTokenBalance ||
    hasMissingMakerAmount ||
    hasMissingMakerToken ||
    hasMissingTakerAmount ||
    hasMissingTakerToken ||
    walletIsNotConnected;

  const buttonText = getActionButtonTranslation(
    t,
    hasInsufficientExpiry,
    hasInsufficientMakerTokenBalance,
    hasMissingMakerAmount,
    hasMissingMakerToken,
    hasMissingTakerAmount,
    hasMissingTakerToken,
    makerTokenSymbol
  );

  return (
    <Container>
      <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
      <SignButton
        disabled={isDisabled}
        intent="primary"
        onClick={onSignButtonClick}
      >
        {buttonText}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
