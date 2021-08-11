import { FC, useState } from "react";

import { LightOrder } from "@airswap/types";
import { TokenInfo } from "@uniswap/token-lists";

import { BigNumber } from "bignumber.js";

import stringToSignificantDecimals from "../../helpers/stringToSignificantDecimals";
import { InfoHeading, InfoSubHeading } from "../Typography/Typography";
import {
  StyledInvertPriceButton,
  StyledInvertPriceIcon,
} from "./InfoSection.styles";

export type InfoSectionProps = {
  isConnected: boolean;
  isFetchingOrders: boolean;
  order: LightOrder | null;
  requiresApproval: boolean;
  signerTokenInfo: TokenInfo | null;
  senderTokenInfo: TokenInfo | null;
};

const InfoSection: FC<InfoSectionProps> = ({
  isConnected,
  order,
  isFetchingOrders,
  requiresApproval,
  senderTokenInfo,
  signerTokenInfo,
}) => {
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
          <InfoSubHeading>Timer goes here.</InfoSubHeading>
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
