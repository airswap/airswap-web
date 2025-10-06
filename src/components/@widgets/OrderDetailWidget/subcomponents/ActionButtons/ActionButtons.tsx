import { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  BackButton,
  Container,
  SignButton,
  StyledCopyLinkButton,
} from "./ActionButtons.styles";

export enum ButtonActions {
  approve = "approve",
  back = "back",
  cancel = "cancel",
  connectWallet = "connectWallet",
  makeNewOrder = "makeNewOrder",
  reloadPage = "reloadPage",
  restart = "restart",
  review = "review",
  switchNetwork = "switchNetwork",
  take = "take",
}

type ActionButtonsProps = {
  hasInsufficientAllowance: boolean;
  hasInsufficientBalance: boolean;
  isCanceled: boolean;
  isExpired: boolean;
  isLimitOrder?: boolean;
  isTaken: boolean;
  isDifferentChainId: boolean;
  isIntendedRecipient: boolean;
  isLoading: boolean;
  isMakerOfSwap: boolean;
  isNotConnected: boolean;
  requiresReload: boolean;
  shouldDepositNativeToken: boolean;
  onActionButtonClick: (action: ButtonActions) => void;
  className?: string;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientAllowance,
  hasInsufficientBalance,
  isCanceled,
  isExpired,
  isLimitOrder,
  isTaken,
  isDifferentChainId,
  isIntendedRecipient,
  isLoading,
  isMakerOfSwap,
  isNotConnected,
  requiresReload,
  shouldDepositNativeToken,
  onActionButtonClick,
  className,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
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
          intent="primary"
          onClick={() => onActionButtonClick(ButtonActions.connectWallet)}
        >
          {t("wallet.connectWallet")}
        </SignButton>
      </Container>
    );
  }

  if (isDifferentChainId) {
    return (
      <Container className={className}>
        <BackButton onClick={() => onActionButtonClick(ButtonActions.back)}>
          {t("common.back")}
        </BackButton>
        <SignButton
          intent="primary"
          onClick={() => onActionButtonClick(ButtonActions.switchNetwork)}
        >
          {t("wallet.switchNetwork")}
        </SignButton>
      </Container>
    );
  }

  if (requiresReload) {
    return (
      <Container center className={className}>
        <SignButton
          intent="primary"
          onClick={() => onActionButtonClick(ButtonActions.reloadPage)}
        >
          {t("common.reloadPage")}
        </SignButton>
      </Container>
    );
  }

  if (isExpired || isTaken || isCanceled) {
    return (
      <Container center className={className}>
        <SignButton
          intent="primary"
          onClick={() => onActionButtonClick(ButtonActions.makeNewOrder)}
        >
          {t("orders.makeNewOrder")}
        </SignButton>
      </Container>
    );
  }

  if (isMakerOfSwap) {
    return (
      <Container className={className}>
        <BackButton onClick={() => onActionButtonClick(ButtonActions.cancel)}>
          {t("orders.cancelOrder")}
        </BackButton>
        <StyledCopyLinkButton>{t("orders.copyLink")}</StyledCopyLinkButton>
      </Container>
    );
  }

  if (!isIntendedRecipient) {
    return (
      <Container className={className}>
        <BackButton onClick={() => onActionButtonClick(ButtonActions.back)}>
          {t("common.back")}
        </BackButton>
        <SignButton disabled intent="neutral">
          {t("orders.unableTake")}
        </SignButton>
      </Container>
    );
  }

  if (shouldDepositNativeToken) {
    return (
      <Container className={className}>
        <BackButton onClick={() => onActionButtonClick(ButtonActions.back)}>
          {t("common.back")}
        </BackButton>
        <SignButton
          intent="primary"
          onClick={() => onActionButtonClick(ButtonActions.review)}
        >
          {t("common.wrap")}
        </SignButton>
      </Container>
    );
  }

  if (hasInsufficientBalance) {
    return (
      <Container className={className}>
        <BackButton onClick={() => onActionButtonClick(ButtonActions.back)}>
          {t("common.back")}
        </BackButton>
        <SignButton disabled intent="neutral" isFilled={true}>
          {t("orders.insufficientBalance")}
        </SignButton>
      </Container>
    );
  }

  if (hasInsufficientAllowance) {
    return (
      <Container className={className}>
        <BackButton onClick={() => onActionButtonClick(ButtonActions.back)}>
          {t("common.back")}
        </BackButton>
        <SignButton
          intent="primary"
          onClick={() => onActionButtonClick(ButtonActions.approve)}
        >
          {t("orders.approve")}
        </SignButton>
      </Container>
    );
  }

  return (
    <Container className={className}>
      <BackButton onClick={() => onActionButtonClick(ButtonActions.back)}>
        {t("common.back")}
      </BackButton>
      <SignButton
        intent="primary"
        onClick={() =>
          isLimitOrder
            ? onActionButtonClick(ButtonActions.review)
            : onActionButtonClick(ButtonActions.take)
        }
      >
        {t("orders.takeSwap")}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
