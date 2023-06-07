import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { OrderERC20, Levels, TokenInfo } from "@airswap/types";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../../../../app/hooks";
import { selectServerUrl } from "../../../../features/userSettings/userSettingsSlice";
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
} from "./InfoSection.styles";

export type InfoSectionProps = {
  isApproving: boolean;
  isConnected: boolean;
  hasSelectedCustomServer: boolean;
  isFetchingOrders: boolean;
  isPairUnavailable: boolean;
  isSwapping: boolean;
  isWrapping: boolean;
  orderSubmitted: boolean;
  orderCompleted: boolean;
  failedToFetchAllowances: boolean;
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
  requiresApproval: boolean;
  quoteTokenInfo: TokenInfo | null;
  baseTokenInfo: TokenInfo | null;
  baseAmount: string;
  showViewAllQuotes: boolean;
  onViewAllQuotesButtonClick: () => void;
  onFeeButtonClick: () => void;
};

const InfoSection: FC<InfoSectionProps> = ({
  isApproving,
  isConnected,
  hasSelectedCustomServer,
  isFetchingOrders,
  isPairUnavailable,
  isSwapping,
  isWrapping,
  orderCompleted,
  orderSubmitted,
  failedToFetchAllowances,
  bestTradeOption,
  requiresApproval,
  baseTokenInfo,
  baseAmount,
  quoteTokenInfo,
  showViewAllQuotes,
  onViewAllQuotesButtonClick,
  onFeeButtonClick,
}) => {
  const { t } = useTranslation();
  const [invertPrice, setInvertPrice] = useState<boolean>(false);
  const serverUrl = useAppSelector(selectServerUrl);

  const genericWelcomeMessage = (
    <>
      <StyledInfoHeading>{t("marketing.welcomeHeading")}</StyledInfoHeading>
      <InfoSubHeading>{t("marketing.welcomeMessage")}</InfoSubHeading>
    </>
  );

  const customServerUrlMessage = (
    <>
      <StyledInfoHeading>
        {/* TODO: Fix ts-ignore */}
        {/* @ts-ignore */}
        {t("orders.selectedServer", { serverUrl })}
      </StyledInfoHeading>
      <InfoSubHeading>{t("orders.scanningPeers")}</InfoSubHeading>
      <ClearServerButton />
    </>
  );

  const tradingPairUnavaialble = (
    <>
      <StyledInfoHeading>{t("orders.tokenPairUnavailable")}</StyledInfoHeading>
      <InfoSubHeading>{t("orders.retryOrCancel")}</InfoSubHeading>
      {showViewAllQuotes && (
        <StyledLargePillButton onClick={onViewAllQuotesButtonClick}>
          {t("orders.viewAllQuotes")}
          <Icon name="chevron-down" />
        </StyledLargePillButton>
      )}
    </>
  );

  const fetchingOrdersMessages = (
    <>
      <StyledInfoHeading>{t("orders.findingBestPrice")}</StyledInfoHeading>
      <InfoSubHeading>{t("orders.scanningPeers")}</InfoSubHeading>
    </>
  );

  const approvingOrderMessages = (
    <>
      <StyledInfoHeading>
        {t("orders.approvePending", { symbol: baseTokenInfo?.symbol })}
      </StyledInfoHeading>
      <InfoSubHeading>{t("orders.approveMessage")}</InfoSubHeading>
    </>
  );

  const swappingMessages = (
    <>
      <StyledInfoHeading>{t("orders.swapPending")}</StyledInfoHeading>
      <InfoSubHeading>{t("orders.swapMessage")}</InfoSubHeading>
    </>
  );

  const isWrappingMessages = (
    <>
      <StyledInfoHeading>
        1 {invertPrice ? quoteTokenInfo?.symbol : baseTokenInfo?.symbol} = 1{" "}
        {invertPrice ? baseTokenInfo?.symbol : quoteTokenInfo?.symbol}
      </StyledInfoHeading>
      <InfoSubHeading>{t("orders.wrapMessage")}</InfoSubHeading>
    </>
  );

  const orderSubmittedMessages = (
    <>
      <DoneAllIcon />
      <StyledInfoHeading>{t("orders.submitted")}</StyledInfoHeading>
      <InfoSubHeading>{t("orders.trackTransaction")}</InfoSubHeading>
    </>
  );

  const orderCompleteMessages = (
    <>
      <DoneAllIcon />
      <StyledInfoHeading>{t("orders.transactionCompleted")}</StyledInfoHeading>
      <InfoSubHeading>{t("orders.trackTransaction")}</InfoSubHeading>
    </>
  );

  if (!isConnected) {
    return genericWelcomeMessage;
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

  if (hasSelectedCustomServer) {
    if (!isPairUnavailable && !bestTradeOption) {
      return customServerUrlMessage;
    } else if (isPairUnavailable) {
      return tradingPairUnavaialble;
    } else if (!isPairUnavailable && !!bestTradeOption && !orderSubmitted) {
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
              1 {invertPrice ? quoteTokenInfo?.symbol : baseTokenInfo?.symbol} ={" "}
              {stringToSignificantDecimals(price.toString())}{" "}
              {invertPrice ? baseTokenInfo?.symbol : quoteTokenInfo?.symbol}
              <RevertPriceButton
                icon="swap"
                ariaLabel={t("orders.revertPrice")}
                iconSize={1}
                onClick={() => setInvertPrice((p) => !p)}
              />
            </StyledInfoHeading>
            <FeeTextContainer>
              <FeeText>{t("marketing.includesFee")}</FeeText>
              <InfoButton
                onClick={onFeeButtonClick}
                ariaLabel={t("orders.moreInformation")}
                icon="information-circle-outline"
              />
            </FeeTextContainer>
          </>
          {requiresApproval && (
            <ApprovalText>
              {t("orders.approvalRequired", { symbol: baseTokenInfo?.symbol })}
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
    } else if (isApproving) {
      return approvingOrderMessages;
    } else if (isSwapping) {
      return swappingMessages;
    } else if (isWrapping) {
      return isWrappingMessages;
    } else if (orderSubmitted && !orderCompleted) {
      return orderSubmittedMessages;
    } else if (orderCompleted) {
      return orderCompleteMessages;
    }
  }

  if (!hasSelectedCustomServer) {
    if (isFetchingOrders) {
      return fetchingOrdersMessages;
    } else if (isPairUnavailable) {
      return tradingPairUnavaialble;
    } else if (orderCompleted) {
      return orderCompleteMessages;
    } else if (orderSubmitted) {
      return orderSubmittedMessages;
    } else if (isApproving) {
      return approvingOrderMessages;
    } else if (isSwapping) {
      return swappingMessages;
    } else if (isWrapping) {
      return isWrappingMessages;
    } else if (!!bestTradeOption) {
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
              1 {invertPrice ? quoteTokenInfo?.symbol : baseTokenInfo?.symbol} ={" "}
              {stringToSignificantDecimals(price.toString())}{" "}
              {invertPrice ? baseTokenInfo?.symbol : quoteTokenInfo?.symbol}
              <RevertPriceButton
                icon="swap"
                ariaLabel={t("orders.revertPrice")}
                iconSize={1}
                onClick={() => setInvertPrice((p) => !p)}
              />
            </StyledInfoHeading>
            <FeeTextContainer>
              <FeeText>{t("marketing.includesFee")}</FeeText>
              <InfoButton
                onClick={onFeeButtonClick}
                ariaLabel={t("orders.moreInformation")}
                icon="information-circle-outline"
              />
            </FeeTextContainer>
          </>
          {requiresApproval && (
            <ApprovalText>
              {t("orders.approvalRequired", { symbol: baseTokenInfo?.symbol })}
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
  }
  return genericWelcomeMessage;
};

export default InfoSection;
