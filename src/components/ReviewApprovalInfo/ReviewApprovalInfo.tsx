import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import { useAppSelector } from "../../app/hooks";
import { selectProtocolFee } from "../../features/metadata/metadataSlice";
import { InfoSubHeading } from "../Typography/Typography";
import { Container, Strong } from "./ReviewApprovalInfo.styles";

interface ReviewApprovalProps {
  amount: string;
  amountPlusFee: string;
  tokenInfo: TokenInfo;
  className?: string;
}

const ReviewApprovalInfo: FC<ReviewApprovalProps> = ({
  amount,
  amountPlusFee,
  tokenInfo,
  className = "",
}) => {
  const { t } = useTranslation();
  const protocolFee = useAppSelector(selectProtocolFee);

  return (
    <Container className={className}>
      <InfoSubHeading>
        {t("orders.shouldApproveErc20TokenAmount", {
          amount,
          protocolFee: protocolFee / 100,
          symbol: tokenInfo.symbol,
        })}
        &nbsp;=
        <Strong>{amountPlusFee}</Strong>
        {tokenInfo.symbol}.
      </InfoSubHeading>
    </Container>
  );
};

export default ReviewApprovalInfo;
