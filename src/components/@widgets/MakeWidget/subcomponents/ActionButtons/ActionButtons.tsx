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
  review,
}

type ActionButtonsProps = {
  hasInsufficientAllowance: boolean;
  hasInsufficientBalance: boolean;
  hasInsufficientExpiry: boolean;
  hasMissingMakerAmount: boolean;
  hasMissingMakerToken: boolean;
  hasMissingTakerAmount: boolean;
  hasMissingTakerToken: boolean;
  isNetworkUnsupported: boolean;
  shouldDepositNativeToken: boolean;
  walletIsNotConnected: boolean;
  makerTokenSymbol?: string;
  takerTokenSymbol?: string;
  onBackButtonClick: (action: ButtonActions) => void;
  onActionButtonClick: (action: ButtonActions) => void;
  className?: string;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientAllowance,
  hasInsufficientBalance,
  hasInsufficientExpiry,
  hasMissingMakerAmount,
  hasMissingMakerToken,
  hasMissingTakerAmount,
  hasMissingTakerToken,
  isNetworkUnsupported,
  shouldDepositNativeToken,
  walletIsNotConnected,
  makerTokenSymbol,
  onBackButtonClick,
  onActionButtonClick,
  className,
}) => {
  const { t } = useTranslation();

  const isDisabled =
    (hasInsufficientExpiry ||
      hasInsufficientBalance ||
      hasMissingMakerAmount ||
      hasMissingMakerToken ||
      hasMissingTakerAmount ||
      hasMissingTakerToken) &&
    !walletIsNotConnected &&
    !isNetworkUnsupported;

  const buttonText = getActionButtonTranslation(
    hasInsufficientAllowance,
    hasInsufficientBalance,
    hasInsufficientExpiry,
    hasMissingMakerAmount,
    hasMissingMakerToken,
    hasMissingTakerAmount,
    hasMissingTakerToken,
    isNetworkUnsupported,
    shouldDepositNativeToken,
    walletIsNotConnected,
    makerTokenSymbol
  );

  const handleSignButtonClick = () => {
    if (walletIsNotConnected) {
      onActionButtonClick(ButtonActions.connectWallet);
    } else if (isNetworkUnsupported) {
      onActionButtonClick(ButtonActions.switchNetwork);
    } else {
      onActionButtonClick(ButtonActions.review);
    }
  };

  const handleBackButtonClick = () => {
    onBackButtonClick(ButtonActions.goBack);
  };

  return (
    <Container className={className}>
      <BackButton onClick={handleBackButtonClick}>
        {t("common.back")}
      </BackButton>
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
