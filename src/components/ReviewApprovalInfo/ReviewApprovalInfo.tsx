import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../../app/hooks";
import { selectProtocolFee } from "../../features/metadata/metadataSlice";
import stringToSignificantDecimals from "../../helpers/stringToSignificantDecimals";
import { InfoSubHeading } from "../Typography/Typography";
import { Container, Strong } from "./ReviewApprovalInfo.styles";

interface ReviewApprovalProps {
  amount: string;
  tokenInfo: TokenInfo;
  className?: string;
}

const ReviewApprovalInfo: FC<ReviewApprovalProps> = ({
  amount,
  tokenInfo,
  className = "",
}) => {
  const { t } = useTranslation();
  const protocolFee = useAppSelector(selectProtocolFee);

  const amountPlusFee = useMemo(() => {
    return stringToSignificantDecimals(
      new BigNumber(amount).multipliedBy(1 + protocolFee / 10000).toString()
    );
  }, [amount, protocolFee]);

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
