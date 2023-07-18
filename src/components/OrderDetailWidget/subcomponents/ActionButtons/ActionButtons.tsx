import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { OrderType } from "../../../../types/orderTypes";
import { BackButton, Container, SignButton } from "./ActionButtons.styles";

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
  isOrderSubmitted: boolean;
  shouldDepositNativeToken: boolean;
  orderType: OrderType;
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
  isOrderSubmitted,
  shouldDepositNativeToken,
  orderType,
  senderTokenSymbol,
  onBackButtonClick,
  onActionButtonClick,
  className,
}) => {
  const { t } = useTranslation();
  const isPrivate = orderType === OrderType.private;
  const isButtonDisabled =
    ((hasInsufficientBalance && !isMakerOfSwap) ||
      (!isIntendedRecipient && !isMakerOfSwap) ||
      isDifferentChainId) &&
    !isNotConnected &&
    !isTaken &&
    !isExpired &&
    !shouldDepositNativeToken;

  const signButtonText = () => {
    if (isNetworkUnsupported) {
      return t("wallet.switchNetwork");
    }

    if (isNotConnected) {
      return t("wallet.connectWallet");
    }

    if (isExpired || isTaken || isCanceled) {
      return t("orders.makeNewOrder");
    }

    if (isMakerOfSwap) {
      return t("orders.cancelOrder");
    }

    if (!isIntendedRecipient) {
      return t("orders.unableTake");
    }

    if (shouldDepositNativeToken) {
      return `Wrap ${senderTokenSymbol}`;
    }

    if (hasInsufficientBalance) {
      return t("orders.insufficientBalance");
    }

    if (hasInsufficientAllowance) {
      return `${t("orders.approve")} ${senderTokenSymbol || ""}`;
    }

    return t("common.review");
  };

  const handleActionButtonClick = () => {
    if (isNetworkUnsupported) {
      return onActionButtonClick(ButtonActions.switchNetwork);
    }

    if (isNotConnected) {
      return onActionButtonClick(ButtonActions.connectWallet);
    }

    if (isExpired || isTaken || isCanceled) {
      return onActionButtonClick(ButtonActions.restart);
    }

    if (isMakerOfSwap) {
      return onActionButtonClick(ButtonActions.cancel);
    }

    return onActionButtonClick(ButtonActions.review);
  };

  return (
    <Container className={className}>
      {!isNotConnected &&
        !isOrderSubmitted &&
        ((isPrivate && !isExpired) || !isPrivate || isTaken) && (
          <BackButton onClick={onBackButtonClick}>
            {isPrivate && !isIntendedRecipient && !isTaken
              ? t("orders.makeNewOrder")
              : t("common.back")}
          </BackButton>
        )}
      <SignButton
        isFilled={
          isNotConnected || isOrderSubmitted || (isPrivate && isExpired)
        }
        intent={isButtonDisabled ? "neutral" : "primary"}
        disabled={isButtonDisabled}
        onClick={handleActionButtonClick}
      >
        {signButtonText()}
      </SignButton>
    </Container>
  );
};

export default ActionButtons;
