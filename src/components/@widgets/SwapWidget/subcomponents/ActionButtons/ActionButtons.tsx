import { FC } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/utils";

import { MainButton, BackButton } from "./ActionButtons.styles";

export enum ButtonActions {
  connectWallet,
  switchNetwork,
  restart,
  goBack,
  approve,
  reloadPage,
  requestQuotes,
  takeQuote,
  trackTransaction,
}

const buttonTextMapping: Record<ButtonActions, string> = {
  [ButtonActions.connectWallet]: "wallet.connectWallet",
  [ButtonActions.switchNetwork]: "wallet.switchNetwork",
  [ButtonActions.reloadPage]: "common.reloadPage",
  [ButtonActions.restart]: "orders.makeNewSwap",
  [ButtonActions.goBack]: "common.back",
  [ButtonActions.approve]: "orders.approve",
  [ButtonActions.requestQuotes]: "orders.continue",
  [ButtonActions.takeQuote]: "orders.takeQuote",
  [ButtonActions.trackTransaction]: "orders.track",
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
  isNetworkUnsupported: boolean;
  requiresReload: boolean;
  hasError: boolean;
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
  isNetworkUnsupported,
  requiresReload,
  hasError,
  hasQuote,
  needsApproval,
  hasAmount,
  baseTokenInfo,
  quoteTokenInfo,
  hasSufficientBalance,
  isLoading,
  onButtonClicked,
}) => {
  const { t } = useTranslation();

  // First determine the next action.
  let nextAction: ButtonActions;
  // Note that wallet is not considered "active" if connected to wrong network
  if (!walletIsActive) nextAction = ButtonActions.connectWallet;
  else if (isNetworkUnsupported) nextAction = ButtonActions.switchNetwork;
  else if (hasError) nextAction = ButtonActions.goBack;
  else if (requiresReload) nextAction = ButtonActions.reloadPage;
  else if (hasQuote && needsApproval) nextAction = ButtonActions.approve;
  else if (hasQuote) nextAction = ButtonActions.takeQuote;
  else nextAction = ButtonActions.requestQuotes;

  // If there's something to fix before progress can be made, the button will
  // be disabled. These disabled states never have a back button.
  let isDisabled =
    walletIsActive &&
    !requiresReload &&
    !isNetworkUnsupported &&
    (!hasSufficientBalance || !baseTokenInfo || !quoteTokenInfo || !hasAmount);

  // Some actions require an additional back button
  const hasBackButton: boolean =
    !isDisabled &&
    (nextAction === ButtonActions.takeQuote ||
      nextAction === ButtonActions.approve);

  // The text depends on the next action, unless the button is disabled, when
  // it depends on the reason for being disabled instead.
  let mainButtonText;
  if (isDisabled) {
    if (!hasAmount) mainButtonText = t("orders.enterAmount");
    else if (!baseTokenInfo || !quoteTokenInfo)
      mainButtonText = t("orders.chooseToken");
    else if (!hasSufficientBalance)
      mainButtonText = t("orders.insufficientBalance", {
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
          {t("common.back")}
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
