import { FC } from "react";
import { useTranslation } from "react-i18next";

import { BackButton, Container, SignButton } from "./NewActionButtons.styles";

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
  isCompleted: boolean;
  isLoading: boolean;
  isNotConnected: boolean;
  requiresReload: boolean;
  shouldEnterAmount: boolean;
  onBackButtonClick: () => void;
  onActionButtonClick: (action: ButtonActions) => void;
  className?: string;
};

const NewActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientAllowance,
  hasInsufficientBalance,
  hasQuote,
  hasError,
  isCompleted,
  isLoading,
  isNotConnected,
  requiresReload,
  shouldEnterAmount,
  onBackButtonClick,
  onActionButtonClick,
  className,
}) => {
  const { t } = useTranslation();

  if (isNotConnected) {
    return (
      <Container center className={className}>
        <SignButton
          isFilled
          intent="primary"
          loading={isLoading}
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
          loading={isLoading}
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
        <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
      </Container>
    );
  }

  if (shouldEnterAmount) {
    return (
      <Container center className={className}>
        <SignButton disabled intent="primary" loading={isLoading}>
          {t("orders.enterAmount")}
        </SignButton>
      </Container>
    );
  }

  if (hasInsufficientBalance) {
    return (
      <Container center className={className}>
        <SignButton disabled loading={isLoading} intent="neutral">
          {t("orders.insufficientBalance")}
        </SignButton>
      </Container>
    );
  }

  if (hasInsufficientAllowance) {
    return (
      <Container className={className}>
        <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
        <SignButton
          intent="primary"
          loading={isLoading}
          onClick={() => onActionButtonClick(ButtonActions.approve)}
        >
          {t("orders.approve")}
        </SignButton>
      </Container>
    );
  }

  if (isCompleted) {
    return (
      <Container className={className}>
        <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
        <SignButton
          intent="primary"
          loading={isLoading}
          onClick={() => onActionButtonClick(ButtonActions.restart)}
        >
          {t("orders.trackTransaction")}
        </SignButton>
      </Container>
    );
  }

  if (hasQuote) {
    return (
      <Container className={className}>
        <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
        <SignButton
          intent="primary"
          loading={isLoading}
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
        loading={isLoading}
        onClick={() => onActionButtonClick(ButtonActions.requestQuotes)}
      >
        {t("orders.continue")}
      </SignButton>
    </Container>
  );
};

export default NewActionButtons;
