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
  approve,
  deposit,
}

type ActionButtonsProps = {
  hasInsufficientAllowance: boolean;
  hasInsufficientBalance: boolean;
  hasInsufficientExpiry: boolean;
  hasMissingMakerAmount: boolean;
  hasMissingMakerToken: boolean;
  hasMissingTakerAmount: boolean;
  hasMissingTakerToken: boolean;
  isLoading: boolean;
  networkIsUnsupported: boolean;
  shouldDepositNativeToken: boolean;
  takerAddressIsInvalid: boolean;
  userIsSigning: boolean;
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
  isLoading,
  networkIsUnsupported,
  shouldDepositNativeToken,
  takerAddressIsInvalid,
  userIsSigning,
  walletIsNotConnected,
  makerTokenSymbol,
  takerTokenSymbol,
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
      hasMissingTakerToken ||
      takerAddressIsInvalid ||
      userIsSigning) &&
    !walletIsNotConnected &&
    !networkIsUnsupported &&
    !shouldDepositNativeToken;

  const buttonText = getActionButtonTranslation(
    hasInsufficientAllowance,
    hasInsufficientBalance,
    hasInsufficientExpiry,
    hasMissingMakerAmount,
    hasMissingMakerToken,
    hasMissingTakerAmount,
    hasMissingTakerToken,
    networkIsUnsupported,
    shouldDepositNativeToken,
    takerAddressIsInvalid,
    walletIsNotConnected,
    makerTokenSymbol,
    takerTokenSymbol
  );

  const handleSignButtonClick = () => {
    if (walletIsNotConnected) {
      onActionButtonClick(ButtonActions.connectWallet);
    } else if (networkIsUnsupported) {
      onActionButtonClick(ButtonActions.switchNetwork);
    } else if (hasInsufficientAllowance) {
      onActionButtonClick(ButtonActions.approve);
    } else if (shouldDepositNativeToken) {
      onActionButtonClick(ButtonActions.deposit);
    } else {
      onActionButtonClick(ButtonActions.sign);
    }
  };

  const handleBackButtonClick = () => {
    if (userIsSigning) {
      onBackButtonClick(ButtonActions.restart);
    } else {
      onBackButtonClick(ButtonActions.goBack);
    }
  };

  return (
    <Container className={className}>
      <BackButton onClick={handleBackButtonClick}>
        {t("common.back")}
      </BackButton>
      <SignButton
        disabled={isDisabled}
        intent="primary"
        loading={isLoading}
        onClick={handleSignButtonClick}
      >
        {buttonText}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
