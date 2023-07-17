import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { OrderERC20, Levels, TokenInfo } from "@airswap/types";

import { BigNumber } from "bignumber.js";

import { SubmittedTransaction } from "../../../../features/transactions/transactionsSlice";
import stringToSignificantDecimals from "../../../../helpers/stringToSignificantDecimals";
import Icon from "../../../Icon/Icon";
import { InfoSubHeading } from "../../../Typography/Typography";
import ClearServerButton from "../ClearServerButton/ClearServerButton";
import {
  StyledInfoHeading,
  RevertPriceButton,
  FeeText,
  InfoButton,
  FeeTextContainer,
  ApprovalText,
  StyledLargePillButton,
  DoneAllIcon,
  StyledTransactionLink,
} from "./InfoSection.styles";

export type InfoSectionProps = {
  failedToFetchAllowances: boolean;
  hasSelectedCustomServer: boolean;
  isApproving: boolean;
  isConnected: boolean;
  isFetchingOrders: boolean;
  isPairUnavailable: boolean;
  isSwapping: boolean;
  isWrapping: boolean;
  orderSubmitted: boolean;
  orderCompleted: boolean;
  requiresApproval: boolean;
  showViewAllQuotes: boolean;
  bestTradeOption:
    | {
        protocol: "last-look-erc20";
        quoteAmount: string;
        pricing: Levels;
      }
    | {
        protocol: "request-for-quote-erc20";
        quoteAmount: string;
        order: OrderERC20;
      }
    | null;
  chainId: number;
  quoteTokenInfo: TokenInfo | null;
  baseTokenInfo: TokenInfo | null;
  baseAmount: string;
  serverUrl: string | null;
  onClearServerUrlButtonClick: () => void;
  onFeeButtonClick: () => void;
  transaction?: SubmittedTransaction;
  onViewAllQuotesButtonClick: () => void;
};

const InfoSection: FC<InfoSectionProps> = ({
  failedToFetchAllowances,
  hasSelectedCustomServer,
  isApproving,
  isConnected,
  isFetchingOrders,
  isPairUnavailable,
  isSwapping,
  isWrapping,
  orderCompleted,
  orderSubmitted,
  requiresApproval,
  showViewAllQuotes,
  bestTradeOption,
  baseTokenInfo,
  baseAmount,
  chainId,
  quoteTokenInfo,
  transaction,
  serverUrl,
  onClearServerUrlButtonClick,
  onFeeButtonClick,
  onViewAllQuotesButtonClick,
}) => {
  const { t } = useTranslation();
  const [invertPrice, setInvertPrice] = useState<boolean>(false);

  // Wallet not connected.
  if (!isConnected) {
    return (
      <>
        <StyledInfoHeading>{t("marketing.welcomeHeading")}</StyledInfoHeading>
        <InfoSubHeading>{t("marketing.welcomeMessage")}</InfoSubHeading>
      </>
    );
  }

  if (
    isConnected &&
    failedToFetchAllowances &&
    (!!bestTradeOption || isWrapping)
  ) {
    return (
      <>
        <StyledInfoHeading>
          {t("balances.failedToFetchAllowances")}
        </StyledInfoHeading>
        <InfoSubHeading>
          {t("balances.failedToFetchAllowancesCta")}
        </InfoSubHeading>
      </>
    );
  }

  if (
    isConnected &&
    failedToFetchAllowances &&
    (!!bestTradeOption || isWrapping)
  ) {
    return (
      <>
        <StyledInfoHeading>
          {t("balances.failedToFetchAllowances")}
        </StyledInfoHeading>
        <InfoSubHeading>
          {t("balances.failedToFetchAllowancesCta")}
        </InfoSubHeading>
      </>
    );
  }

  if (isFetchingOrders) {
    return (
      <>
        <StyledInfoHeading>{t("orders.findingBestPrice")}</StyledInfoHeading>
        <InfoSubHeading>{t("orders.scanningPeers")}</InfoSubHeading>
      </>
    );
  }

  if (isPairUnavailable) {
    return (
      <>
        <StyledInfoHeading>
          {t("orders.tokenPairUnavailable")}
        </StyledInfoHeading>
        <InfoSubHeading>{t("orders.retryOrCancel")}</InfoSubHeading>
        {showViewAllQuotes && (
          <StyledLargePillButton onClick={onViewAllQuotesButtonClick}>
            {t("orders.viewAllQuotes")}
            <Icon name="chevron-down" />
          </StyledLargePillButton>
        )}
      </>
    );
  }

  if (orderCompleted) {
    return (
      <>
        <DoneAllIcon />
        <StyledInfoHeading>
          {t("orders.transactionCompleted")}
        </StyledInfoHeading>
        {transaction?.hash && (
          <StyledTransactionLink chainId={chainId} hash={transaction?.hash} />
        )}
      </>
    );
  }

  if (orderSubmitted) {
    return (
      <>
        <DoneAllIcon />
        <StyledInfoHeading>{t("orders.submitted")}</StyledInfoHeading>
        <InfoSubHeading>{t("orders.trackTransaction")}</InfoSubHeading>
        {transaction?.hash && (
          <StyledTransactionLink chainId={chainId} hash={transaction?.hash} />
        )}
      </>
    );
  }

  if (isApproving) {
    return (
      <>
        <StyledInfoHeading>
          {t("orders.approvePending", { symbol: baseTokenInfo!.symbol })}
        </StyledInfoHeading>
        <InfoSubHeading>{t("orders.approveMessage")}</InfoSubHeading>
      </>
    );
  }

  if (isSwapping) {
    return (
      <>
        <StyledInfoHeading>{t("orders.swapPending")}</StyledInfoHeading>
        <InfoSubHeading>{t("orders.swapMessage")}</InfoSubHeading>
      </>
    );
  }

  if (isWrapping) {
    return (
      <>
        <StyledInfoHeading>
          1 {invertPrice ? quoteTokenInfo!.symbol : baseTokenInfo!.symbol} = 1{" "}
          {invertPrice ? baseTokenInfo!.symbol : quoteTokenInfo!.symbol}
        </StyledInfoHeading>
        <InfoSubHeading>{t("orders.wrapMessage")}</InfoSubHeading>
      </>
    );
  }

  if (!!bestTradeOption) {
    let price = new BigNumber(bestTradeOption.quoteAmount).dividedBy(
      baseAmount
    );

    if (invertPrice) {
      price = new BigNumber(1).dividedBy(price);
    }

    return (
      <>
        <>
          <StyledInfoHeading>
            1 {invertPrice ? quoteTokenInfo!.symbol : baseTokenInfo!.symbol} ={" "}
            {stringToSignificantDecimals(price.toString())}{" "}
            {invertPrice ? baseTokenInfo!.symbol : quoteTokenInfo!.symbol}
            <RevertPriceButton
              icon="swap"
              ariaLabel={t("orders.revertPrice")}
              iconSize={1}
              onClick={() => setInvertPrice((p) => !p)}
            />
          </StyledInfoHeading>
        </>
        {requiresApproval && (
          <ApprovalText>
            {t("orders.approvalRequired", { symbol: baseTokenInfo!.symbol })}
          </ApprovalText>
        )}
        {showViewAllQuotes && (
          <StyledLargePillButton onClick={onViewAllQuotesButtonClick}>
            {t("orders.viewAllQuotes")}
            <Icon name="chevron-down" />
          </StyledLargePillButton>
        )}
      </>
    );
  }

  if (hasSelectedCustomServer) {
    return (
      <>
        <StyledInfoHeading>
          {t("orders.selectedServer", { serverUrl })}
        </StyledInfoHeading>
        <ClearServerButton onClick={onClearServerUrlButtonClick} />
      </>
    );
  }

  // No order & not fetching, but wallet connected.
  return (
    <>
      <StyledInfoHeading>{t("marketing.welcomeHeading")}</StyledInfoHeading>
      <InfoSubHeading>{t("marketing.welcomeMessage")}</InfoSubHeading>
    </>
  );
};

export default InfoSection;
