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

type ActionButtonsProps = {
  hasInsufficientExpiry: boolean;
  hasInsufficientMakerTokenBalance: boolean;
  hasMissingMakerAmount: boolean;
  hasMissingMakerToken: boolean;
  hasMissingTakerAmount: boolean;
  hasMissingTakerToken: boolean;
  networkIsUnsupported: boolean;
  takerAddressIsInvalid: boolean;
  userIsSigning: boolean;
  walletIsNotConnected: boolean;
  makerTokenSymbol?: string;
  takerTokenSymbol?: string;
  onBackButtonClick: () => void;
  onSignButtonClick: (action: ButtonActions) => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientExpiry,
  hasInsufficientMakerTokenBalance,
  hasMissingMakerAmount,
  hasMissingMakerToken,
  hasMissingTakerAmount,
  hasMissingTakerToken,
  networkIsUnsupported,
  takerAddressIsInvalid,
  userIsSigning,
  walletIsNotConnected,
  makerTokenSymbol,
  takerTokenSymbol,
  onBackButtonClick,
  onSignButtonClick,
}) => {
  const { t } = useTranslation();

  const isDisabled =
    (hasInsufficientExpiry ||
      hasInsufficientMakerTokenBalance ||
      hasMissingMakerAmount ||
      hasMissingMakerToken ||
      hasMissingTakerAmount ||
      hasMissingTakerToken ||
      takerAddressIsInvalid ||
      userIsSigning) &&
    (!walletIsNotConnected || !networkIsUnsupported);

  const buttonText = getActionButtonTranslation(
    hasInsufficientExpiry,
    hasInsufficientMakerTokenBalance,
    hasMissingMakerAmount,
    hasMissingMakerToken,
    hasMissingTakerAmount,
    hasMissingTakerToken,
    networkIsUnsupported,
    takerAddressIsInvalid,
    walletIsNotConnected,
    makerTokenSymbol,
    takerTokenSymbol
  );

  const handleSignButtonClick = () => {
    if (walletIsNotConnected) {
      onSignButtonClick(ButtonActions.connectWallet);
    } else if (networkIsUnsupported) {
      onSignButtonClick(ButtonActions.switchNetwork);
    } else {
      onSignButtonClick(ButtonActions.sign);
    }
  };

  return (
    <Container>
      <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
      <SignButton
        disabled={isDisabled}
        intent="primary"
        onClick={handleSignButtonClick}
      >
        {buttonText}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
