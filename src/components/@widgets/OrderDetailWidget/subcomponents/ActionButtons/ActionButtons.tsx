import { OrderType } from "../../../../../types/orderTypes";
import CopyLinkButton from "../CopyLinkButton/CopyLinkButton";
import {
  BackButton,
  Container,
  SignButton,
  StyledCopyLinkButton,
} from "./ActionButtons.styles";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

export enum ButtonActions {
  connectWallet,
  switchNetwork,
  reloadPage,
  restart,
  cancel,
  review,
}

type ActionButtonsProps = {
  hasInsufficientAllowance: boolean;
  hasInsufficientBalance: boolean;
  isCanceled: boolean;
  isExpired: boolean;
  isTaken: boolean;
  isDifferentChainId: boolean;
  isIntendedRecipient: boolean;
  isMakerOfSwap: boolean;
  isNetworkUnsupported: boolean;
  isNotConnected: boolean;
  shouldDepositNativeToken: boolean;
  senderTokenSymbol?: string;
  onBackButtonClick: () => void;
  onActionButtonClick: (action: ButtonActions) => void;
  className?: string;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientAllowance,
  hasInsufficientBalance,
  isCanceled,
  isExpired,
  isTaken,
  isDifferentChainId,
  isIntendedRecipient,
  isMakerOfSwap,
  isNotConnected,
  isNetworkUnsupported,
  shouldDepositNativeToken,
  senderTokenSymbol,
  onBackButtonClick,
  onActionButtonClick,
  className,
}) => {
  const { t } = useTranslation();

  if (isNotConnected) {
    return (
      <Container className={className}>
        <SignButton
          isFilled
          intent="primary"
          onClick={() => onActionButtonClick(ButtonActions.connectWallet)}
        >
          {t("wallet.connectWallet")}
        </SignButton>
      </Container>
    );
  }

  if (isNetworkUnsupported || isDifferentChainId) {
    return (
      <Container className={className}>
        <SignButton
          isFilled
          intent="primary"
          onClick={() => onActionButtonClick(ButtonActions.switchNetwork)}
        >
          {t("wallet.switchNetwork")}
        </SignButton>
      </Container>
    );
  }

  if (isExpired || isTaken || isCanceled) {
    return (
      <Container className={className}>
        <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
        <SignButton
          intent="primary"
          onClick={() => onActionButtonClick(ButtonActions.restart)}
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
        <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
        <SignButton disabled intent="neutral">
          {t("orders.unableTake")}
        </SignButton>
      </Container>
    );
  }

  if (shouldDepositNativeToken) {
    return (
      <Container className={className}>
        <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
        <SignButton
          intent="primary"
          onClick={() => onActionButtonClick(ButtonActions.review)}
        >
          {`${t("common.wrap")} ${senderTokenSymbol}`}
        </SignButton>
      </Container>
    );
  }

  if (hasInsufficientBalance) {
    return (
      <Container className={className}>
        <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
        <SignButton disabled intent="neutral">
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
          onClick={() => onActionButtonClick(ButtonActions.review)}
        >
          {`${t("orders.approve")} ${senderTokenSymbol || ""}`}
        </SignButton>
      </Container>
    );
  }

  return (
    <Container className={className}>
      <BackButton onClick={onBackButtonClick}>{t("common.back")}</BackButton>
      <SignButton
        intent="primary"
        onClick={() => onActionButtonClick(ButtonActions.review)}
      >
        {t("common.review")}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
