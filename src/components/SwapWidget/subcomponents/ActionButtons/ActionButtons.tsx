import { FC } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import { MainButton, BackButton } from "./ActionButtons.styles";

export enum ButtonActions {
  connectWallet,
  restart,
  goBack,
  approve,
  requestQuotes,
  takeQuote,
}

const buttonTextMapping: Record<ButtonActions, string> = {
  [ButtonActions.connectWallet]: "wallet:connectWallet",
  [ButtonActions.restart]: "orders:newSwap",
  [ButtonActions.goBack]: "common:back",
  [ButtonActions.approve]: "orders:approve",
  [ButtonActions.requestQuotes]: "orders:continue",
  [ButtonActions.takeQuote]: "orders:take",
};

/**
 * This can either be:
 *  - Connect wallet button (Wallet not connected, OR isConnecting [loading])
 *  - Invisible (approving and swapping - TBD - could be overlay)
 *  - Back button (pair unavailable)
 *  - New swap button (to restart after order has been submitted)
 *  - "Back" and "Complete Swap" buttons (when ready to go)
 *  - "Back" and "Approve" buttons
 *  - A disabled button containing reason text (enter an amount, token info
 *    not found, or insufficient balance)
 *  - A continue button to request quotes
 */
const ActionButtons: FC<{
  walletIsActive: boolean;
  orderComplete: boolean;
  pairUnavailable: boolean;
  hasQuote: boolean;
  needsApproval: boolean;
  hasAmount: boolean;
  baseTokenInfo: TokenInfo | null;
  quoteTokenInfo: TokenInfo | null;
  hasSufficientBalance: boolean;
  isLoading: boolean;
  onButtonClicked: (action: ButtonActions) => void;
}> = ({
  walletIsActive,
  orderComplete,
  pairUnavailable,
  hasQuote,
  needsApproval,
  hasAmount,
  baseTokenInfo,
  quoteTokenInfo,
  hasSufficientBalance,
  isLoading,
  onButtonClicked,
}) => {
  const { t } = useTranslation(["wallet", "common", "orders"]);

  // First determine the next action.
  let nextAction: ButtonActions;
  if (!walletIsActive) nextAction = ButtonActions.connectWallet;
  else if (pairUnavailable) nextAction = ButtonActions.goBack;
  else if (orderComplete) nextAction = ButtonActions.restart;
  else if (hasQuote && needsApproval) nextAction = ButtonActions.approve;
  else if (hasQuote) nextAction = ButtonActions.takeQuote;
  else nextAction = ButtonActions.requestQuotes;

  // If there's something to fix before progress can be made, the button will
  // be disabled. These disabled states never have a back button.
  const isDisabled =
    !hasSufficientBalance ||
    (walletIsActive && (!baseTokenInfo || !quoteTokenInfo)) ||
    !hasAmount;

  // Some actions require an additional back button
  const hasBackButton: boolean =
    !isDisabled &&
    (nextAction === ButtonActions.takeQuote ||
      nextAction === ButtonActions.approve);

  // The text depends on the next action, unless the button is disabled, when
  // it depends on the reason for being disabled instead.
  let mainButtonText;
  if (isDisabled) {
    if (!hasAmount) mainButtonText = t("orders:enterAmount");
    else if (!baseTokenInfo || !quoteTokenInfo)
      mainButtonText = t("orders:chooseToken");
    else if (!hasSufficientBalance)
      mainButtonText = t("orders:insufficentBalance", {
        symbol: baseTokenInfo.symbol,
      });
  } else {
    // @ts-ignore dynamic translation key.
    mainButtonText = t(buttonTextMapping[nextAction]);
  }

  return (
    <>
      {hasBackButton && (
        <BackButton onClick={onButtonClicked.bind(null, ButtonActions.goBack)}>
          {t("common:back")}
        </BackButton>
      )}
      <MainButton
        intent={nextAction === ButtonActions.goBack ? "neutral" : "primary"}
        loading={isLoading}
        disabled={isDisabled}
        onClick={onButtonClicked.bind(null, nextAction)}
      >
        {mainButtonText}
      </MainButton>
    </>
  );
};

export default ActionButtons;
