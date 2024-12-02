import { FC } from "react";
import { useTranslation } from "react-i18next";

import { BackButton, Container, SignButton } from "./ActionButtons.styles";

export enum ButtonActions {
  approve = "approve",
  connectWallet = "connectWallet",
  goBack = "goBack",
  reloadPage = "reloadPage",
  requestQuotes = "requestQuotes",
  restart = "restart",
  switchNetwork = "switchNetwork",
  takeQuote = "takeQuote",
  trackTransaction = "trackTransaction",
}

type ActionButtonsProps = {
  hasInsufficientAllowance: boolean;
  hasInsufficientBalance: boolean;
  hasQuote: boolean;
  hasError: boolean;
  isBalanceLoading: boolean;
  isLoading: boolean;
  isNotConnected: boolean;
  requiresReload: boolean;
  shouldEnterAmount: boolean;
  onBackButtonClick: () => void;
  onActionButtonClick: (action: ButtonActions) => void;
  className?: string;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientAllowance,
  hasInsufficientBalance,
  hasQuote,
  hasError,
  isBalanceLoading,
  isLoading,
  isNotConnected,
  requiresReload,
  shouldEnterAmount,
  onBackButtonClick,
  onActionButtonClick,
  className,
}) => {
  const { t } = useTranslation();

  const handleBackButtonClick = () => {
    onActionButtonClick(ButtonActions.goBack);
  };

  if (isBalanceLoading) {
    return (
      <Container center className={className}>
        <SignButton disabled intent="primary" loading />
      </Container>
    );
  }

  if (isNotConnected) {
    return (
      <Container center className={className}>
        <SignButton
          isFilled
          intent="primary"
          disabled={isLoading}
          onClick={() => onActionButtonClick(ButtonActions.connectWallet)}
        >
          {t("wallet.connectWallet")}
        </SignButton>
      </Container>
    );
  }

  if (requiresReload) {
    return (
      <Container className={className}>
        <SignButton
          intent="primary"
          disabled={isLoading}
          onClick={() => onActionButtonClick(ButtonActions.reloadPage)}
        >
          {t("common.reloadPage")}
        </SignButton>
      </Container>
    );
  }

  if (hasError) {
    return (
      <Container center className={className}>
        <BackButton onClick={handleBackButtonClick}>
          {t("common.back")}
        </BackButton>
      </Container>
    );
  }

  if (shouldEnterAmount) {
    return (
      <Container center className={className}>
        <SignButton disabled intent="primary">
          {t("orders.enterAmount")}
        </SignButton>
      </Container>
    );
  }

  if (hasInsufficientBalance) {
    return (
      <Container center className={className}>
        <SignButton disabled intent="neutral">
          {t("orders.insufficientBalance")}
        </SignButton>
      </Container>
    );
  }

  if (hasInsufficientAllowance) {
    return (
      <Container className={className}>
        <BackButton onClick={handleBackButtonClick}>
          {t("common.back")}
        </BackButton>
        <SignButton
          intent="primary"
          disabled={isLoading}
          onClick={() => onActionButtonClick(ButtonActions.approve)}
        >
          {t("orders.approve")}
        </SignButton>
      </Container>
    );
  }

  if (hasQuote) {
    return (
      <Container className={className}>
        <BackButton onClick={handleBackButtonClick}>
          {t("common.back")}
        </BackButton>
        <SignButton
          intent="primary"
          disabled={isLoading}
          onClick={() => onActionButtonClick(ButtonActions.takeQuote)}
        >
          {t("orders.takeQuote")}
        </SignButton>
      </Container>
    );
  }

  return (
    <Container center className={className}>
      <SignButton
        intent="primary"
        disabled={isLoading}
        onClick={() => onActionButtonClick(ButtonActions.requestQuotes)}
      >
        {t("orders.continue")}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
