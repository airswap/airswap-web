import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { MakeWidgetState } from "../../MakeWidget";
import { getActionButtonTranslation } from "../../helpers";
import { BackButton, Container, SignButton } from "./ActionButtons.styles";

export enum ButtonActions {
  connectWallet,
  switchNetwork,
  reloadPage,
  restart,
  goBack,
  review,
  list,
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
  isNetworkUnsupported: boolean;
  shouldDepositNativeToken: boolean;
  walletIsNotConnected: boolean;
  makerTokenSymbol?: string;
  takerTokenSymbol?: string;
  widgetState: MakeWidgetState;
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
  isNetworkUnsupported,
  shouldDepositNativeToken,
  walletIsNotConnected,
  makerTokenSymbol,
  widgetState,
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
    widgetState,
    makerTokenSymbol
  );

  const handleSignButtonClick = () => {
    if (walletIsNotConnected) {
      onActionButtonClick(ButtonActions.connectWallet);
    } else if (isNetworkUnsupported) {
      onActionButtonClick(ButtonActions.switchNetwork);
    } else if (widgetState === MakeWidgetState.list) {
      onActionButtonClick(ButtonActions.review);
    } else if (shouldDepositNativeToken) {
      onActionButtonClick(ButtonActions.deposit);
    } else if (hasInsufficientAllowance) {
      onActionButtonClick(ButtonActions.approve);
    } else {
      onActionButtonClick(ButtonActions.sign);
    }
  };

  const handleBackButtonClick = () => {
    if (widgetState === MakeWidgetState.review) {
      onBackButtonClick(ButtonActions.list);
    } else {
      onBackButtonClick(ButtonActions.goBack);
    }
  };

  return (
    <Container className={className}>
      <BackButton onClick={handleBackButtonClick}>
        {widgetState === MakeWidgetState.review
          ? t("common.edit")
          : t("common.back")}
      </BackButton>
      <SignButton
        disabled={isDisabled}
        intent="primary"
        loading={widgetState === MakeWidgetState.review && isLoading}
        onClick={handleSignButtonClick}
      >
        {buttonText}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
