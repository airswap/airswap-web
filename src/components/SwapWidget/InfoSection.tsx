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
  isFetchingOrders: boolean;
  order: LightOrder | null;
  requiresApproval: boolean;
  signerTokenInfo: TokenInfo | null;
  senderTokenInfo: TokenInfo | null;
  timerExpiry: number | null;
  onTimerComplete: () => void;
};

const InfoSection: FC<InfoSectionProps> = ({
  isConnected,
  order,
  isFetchingOrders,
  requiresApproval,
  senderTokenInfo,
  signerTokenInfo,
  timerExpiry,
  onTimerComplete,
}) => {
  const { t } = useTranslation(["orders"]);
  const [invertPrice, setInvertPrice] = useState<boolean>(false);
  // Wallet not connected.
  if (!isConnected) {
    return (
      <>
        <InfoHeading>Zero slippage atomic swaps</InfoHeading>
        <InfoSubHeading>Low fees for community members.</InfoSubHeading>
      </>
    );
  }

  if (isFetchingOrders) {
    return (
      <>
        <InfoHeading>Finding the best prices...</InfoHeading>
        <InfoSubHeading>Scanning peers on the network</InfoSubHeading>
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
            To proceed you must approve {senderTokenInfo!.symbol}
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
      <InfoHeading>0.3% protocol fee active</InfoHeading>
      <InfoSubHeading>Lower fees for community members.</InfoSubHeading>
    </>
  );
};

export default InfoSection;
