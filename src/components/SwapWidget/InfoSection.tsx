import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { LightOrder } from "@airswap/types";
import { TokenInfo } from "@uniswap/token-lists";

import { BigNumber } from "bignumber.js";

import Timer from "../../components/Timer/Timer";
import { Levels } from "../../features/pricing/pricingSlice";
import stringToSignificantDecimals from "../../helpers/stringToSignificantDecimals";
import { InfoHeading, InfoSubHeading } from "../Typography/Typography";
import {
  StyledInvertPriceButton,
  StyledInvertPriceIcon,
  TimerContainer,
  NewQuoteText,
  TimerText,
  StyledInfoHeading,
} from "./InfoSection.styles";

export type InfoSectionProps = {
  isConnected: boolean;
  isPairUnavailable: boolean;
  orderSubmitted: boolean;
  isFetchingOrders: boolean;
  isApproving: boolean;
  isSwapping: boolean;
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
  requiresApproval: boolean;
  signerTokenInfo: TokenInfo | null;
  senderTokenInfo: TokenInfo | null;
  timerExpiry: number | null;
  onTimerComplete: () => void;
};

const InfoSection: FC<InfoSectionProps> = ({
  isConnected,
  isPairUnavailable,
  orderSubmitted,
  isApproving,
  isSwapping,
  bestTradeOption,
  isFetchingOrders,
  requiresApproval,
  senderTokenInfo,
  signerTokenInfo,
  timerExpiry,
  onTimerComplete,
}) => {
  const { t } = useTranslation(["orders", "marketing"]);
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
          {t("orders:approvePending", { symbol: senderTokenInfo!.symbol })}
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

  if (!!bestTradeOption) {
    // TODO: ideally refactor out bignumber.js
    let price = new BigNumber(bestTradeOption.quoteAmount);

    if (invertPrice) {
      price = new BigNumber(1).dividedBy(price);
    }

    return (
      <>
        <StyledInfoHeading>
          1 {invertPrice ? signerTokenInfo!.symbol : senderTokenInfo!.symbol} ={" "}
          {stringToSignificantDecimals(price.toString())}{" "}
          {invertPrice ? senderTokenInfo!.symbol : signerTokenInfo!.symbol}
          <StyledInvertPriceButton onClick={() => setInvertPrice((p) => !p)}>
            <StyledInvertPriceIcon />
          </StyledInvertPriceButton>
        </StyledInfoHeading>
        {requiresApproval ? (
          <InfoSubHeading>
            {t("orders:approvalRequired", { symbol: senderTokenInfo!.symbol })}
          </InfoSubHeading>
        ) : (
          <InfoSubHeading>
            <TimerContainer>
              <NewQuoteText>{t("orders:newQuoteIn")}</NewQuoteText>
              {/* FIXME: If RFQ isn't the best trade option, the RFQ quotes will no longer refresh */}
              {bestTradeOption.protocol === "request-for-quote" && (
                <TimerText>
                  <Timer
                    expiryTime={timerExpiry!}
                    onTimerComplete={onTimerComplete}
                  ></Timer>
                </TimerText>
              )}
              {bestTradeOption.protocol === "last-look" && (
                <TimerText>Gas free trade</TimerText>
              )}
            </TimerContainer>
          </InfoSubHeading>
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
