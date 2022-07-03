import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/typescript";
import { Levels } from "@airswap/typescript";
import { Order } from "@airswap/typescript";

import { BigNumber } from "bignumber.js";

import stringToSignificantDecimals from "../../../../helpers/stringToSignificantDecimals";
import { InfoSubHeading } from "../../../Typography/Typography";
import {
  StyledInfoHeading,
  RevertPriceButton,
  FeeText,
  InfoButton,
  FeeTextContainer,
  ApprovalText,
} from "./InfoSection.styles";

export type InfoSectionProps = {
  isConnected: boolean;
  isPairUnavailable: boolean;
  orderSubmitted: boolean;
  isFetchingOrders: boolean;
  isApproving: boolean;
  isSwapping: boolean;
  failedToFetchAllowances: boolean;
  bestTradeOption:
    | {
        protocol: "last-look";
        quoteAmount: string;
        pricing: Levels;
      }
    | {
        protocol: "request-for-quote";
        quoteAmount: string;
        order: Order;
      }
    | null;
  isWrapping: boolean;
  requiresApproval: boolean;
  quoteTokenInfo: TokenInfo | null;
  baseTokenInfo: TokenInfo | null;
  baseAmount: string;
  onFeeButtonClick: () => void;
};

const InfoSection: FC<InfoSectionProps> = ({
  isConnected,
  isPairUnavailable,
  orderSubmitted,
  isApproving,
  isSwapping,
  failedToFetchAllowances,
  bestTradeOption,
  isWrapping,
  isFetchingOrders,
  requiresApproval,
  baseTokenInfo,
  baseAmount,
  quoteTokenInfo,
  onFeeButtonClick,
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
      </>
    );
  }

  if (orderSubmitted) {
    return (
      <>
        <StyledInfoHeading>{t("orders.submitted")}</StyledInfoHeading>
        <InfoSubHeading>{t("orders.trackTransaction")}</InfoSubHeading>
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
            {t("orders.approvalRequired", { symbol: baseTokenInfo!.symbol })}
          </ApprovalText>
        )}
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
