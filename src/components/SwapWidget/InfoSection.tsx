import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { LightOrder } from "@airswap/types";
import { TokenInfo } from "@uniswap/token-lists";

import { BigNumber } from "bignumber.js";

import Timer from "../../components/Timer/Timer";
import stringToSignificantDecimals from "../../helpers/stringToSignificantDecimals";
import { InfoHeading, InfoSubHeading } from "../Typography/Typography";
import {
  StyledInvertPriceButton,
  StyledInvertPriceIcon,
  TimerContainer,
  NewQuoteText,
  TimerText,
} from "./InfoSection.styles";

export type InfoSectionProps = {
  isConnected: boolean;
  isPairUnavailable: boolean;
  orderSubmitted: boolean;
  isFetchingOrders: boolean;
  isApproving: boolean;
  isSwapping: boolean;
  order: LightOrder | null;
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
  order,
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

  if (!!order) {
    // TODO: ideally refactor out bignumber.js
    let price = new BigNumber(order.signerAmount)
      .dividedBy(new BigNumber(order.senderAmount))
      .dividedBy(10 ** (signerTokenInfo!.decimals - senderTokenInfo!.decimals));

    if (invertPrice) {
      price = new BigNumber(1).dividedBy(price);
    }

    return (
      <>
        <InfoHeading>
          1 {invertPrice ? signerTokenInfo!.symbol : senderTokenInfo!.symbol} ={" "}
          {stringToSignificantDecimals(price.toString())}{" "}
          {invertPrice ? senderTokenInfo!.symbol : signerTokenInfo!.symbol}
          <StyledInvertPriceButton onClick={() => setInvertPrice((p) => !p)}>
            <StyledInvertPriceIcon />
          </StyledInvertPriceButton>
        </InfoHeading>
        {requiresApproval ? (
          <InfoSubHeading>
            {t("orders:approvalRequired", { symbol: senderTokenInfo!.symbol })}
          </InfoSubHeading>
        ) : (
          <InfoSubHeading>
            <TimerContainer>
              <NewQuoteText>{t("orders:newQuoteIn")}</NewQuoteText>
              {order && (
                <TimerText>
                  <Timer
                    expiryTime={timerExpiry!}
                    onTimerComplete={onTimerComplete}
                  ></Timer>
                </TimerText>
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
