import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";
import { Levels } from "@airswap/types";
import { LightOrder } from "@airswap/types";

import { BigNumber } from "bignumber.js";

import stringToSignificantDecimals from "../../helpers/stringToSignificantDecimals";
import { InfoHeading, InfoSubHeading } from "../Typography/Typography";
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
        order: LightOrder;
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
  const { t } = useTranslation(["orders", "marketing", "balances"]);
  const [invertPrice, setInvertPrice] = useState<boolean>(false);
  // Wallet not connected.
  if (!isConnected) {
    return (
      <>
        <InfoHeading>{t("marketing:useAtOwnRisk")}</InfoHeading>
        <InfoSubHeading>{t("marketing:alphaPreview")}</InfoSubHeading>
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
        <InfoHeading>{t("balances:failedToFetchAllowances")}</InfoHeading>
        <InfoSubHeading>
          {t("balances:failedToFetchAllowancesCta")}
        </InfoSubHeading>
      </>
    );
  }

  if (isFetchingOrders) {
    return (
      <>
        <InfoHeading>{t("orders:findingBestPrice")}</InfoHeading>
        <InfoSubHeading>{t("orders:scanningPeers")}</InfoSubHeading>
      </>
    );
  }

  if (isPairUnavailable) {
    return (
      <>
        <InfoHeading>{t("orders:tokenPairUnavailable")}</InfoHeading>
        <InfoSubHeading>{t("orders:retryOrCancel")}</InfoSubHeading>
      </>
    );
  }

  if (orderSubmitted) {
    return (
      <>
        <InfoHeading>{t("orders:submitted")}</InfoHeading>
        <InfoSubHeading>{t("orders:trackTransaction")}</InfoSubHeading>
      </>
    );
  }

  if (isApproving) {
    return (
      <>
        <InfoHeading>
          {t("orders:approvePending", { symbol: baseTokenInfo!.symbol })}
        </InfoHeading>
        <InfoSubHeading>{t("orders:approveMessage")}</InfoSubHeading>
      </>
    );
  }

  if (isSwapping) {
    return (
      <>
        <InfoHeading>{t("orders:swapPending")}</InfoHeading>
        <InfoSubHeading>{t("orders:swapMessage")}</InfoSubHeading>
      </>
    );
  }

  if (isWrapping) {
    return (
      <>
        <InfoHeading>
          1 {invertPrice ? quoteTokenInfo!.symbol : baseTokenInfo!.symbol} = 1{" "}
          {invertPrice ? baseTokenInfo!.symbol : quoteTokenInfo!.symbol}
        </InfoHeading>
        <InfoSubHeading>{t("orders:wrapMessage")}</InfoSubHeading>
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
              iconSize={1}
              onClick={() => setInvertPrice((p) => !p)}
            />
          </StyledInfoHeading>
          <FeeTextContainer>
            <FeeText>{t("marketing:includesFee")}</FeeText>
            <InfoButton
              onClick={onFeeButtonClick}
              icon="information-circle-outline"
            />
          </FeeTextContainer>
        </>
        {requiresApproval && (
          <ApprovalText>
            {t("orders:approvalRequired", { symbol: baseTokenInfo!.symbol })}
          </ApprovalText>
        )}
      </>
    );
  }

  // No order & not fetching, but wallet connected.
  return (
    <>
      <InfoHeading>{t("marketing:useAtOwnRisk")}</InfoHeading>
      <InfoSubHeading>{t("marketing:alphaPreview")}</InfoSubHeading>
    </>
  );
};

export default InfoSection;
