import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import useShouldDepositNativeTokenAmountInfo from "../../../../hooks/useShouldDepositNativeTokenAmountInfo";
import { Strong } from "../../../OrderDetailWidget/subcomponents/InfoSection/InfoSection.styles";
import { InfoSubHeading } from "../../../Typography/Typography";
import { Container } from "./InfoSection.styles";

type ActionButtonsProps = {
  shouldDepositNativeTokenAmount?: string;
  showApprovalAmountPlusFee?: boolean;
  makerTokenInfo?: TokenInfo;
  makerAmountPlusFee?: string;
  protocolFee?: number;
  className?: string;
};

const InfoSection: FC<ActionButtonsProps> = ({
  shouldDepositNativeTokenAmount,
  showApprovalAmountPlusFee,
  makerTokenInfo,
  makerAmountPlusFee,
  protocolFee = 7,
  className,
}) => {
  const { t } = useTranslation();

  const {
    nativeToken,
    wrappedNativeTokenSymbol,
    ownedWrappedNativeTokenAmount,
  } = useShouldDepositNativeTokenAmountInfo();

  if (shouldDepositNativeTokenAmount) {
    return (
      <Container className={className}>
        <InfoSubHeading>
          {t("orders.shouldDepositNativeTokenAmount", {
            wrappedNativeTokenSymbol,
            ownedWrappedNativeTokenAmount,
          })}
          &nbsp;
          <Strong>{shouldDepositNativeTokenAmount}</Strong>
          &nbsp;
          {nativeToken}.
        </InfoSubHeading>
      </Container>
    );
  }

  if (showApprovalAmountPlusFee && makerTokenInfo) {
    return (
      <Container className={className}>
        <InfoSubHeading>
          {t("orders.shouldApproveErc20TokenAmount", {
            makerAmountPlusFee,
            protocolFee: protocolFee / 100,
            symbol: makerTokenInfo.symbol,
          })}
          &nbsp;=
          <Strong>{makerAmountPlusFee}</Strong>
          {makerTokenInfo.symbol}.
        </InfoSubHeading>
      </Container>
    );
  }

  return null;
};

export default InfoSection;
