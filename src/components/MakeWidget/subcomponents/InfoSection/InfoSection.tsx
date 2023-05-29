import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import useShouldDepositNativeTokenAmountInfo from "../../../../hooks/useShouldDepositNativeTokenAmountInfo";
import { Strong } from "../../../OrderDetailWidget/subcomponents/InfoSection/InfoSection.styles";
import { InfoSubHeading } from "../../../Typography/Typography";
import { Container } from "./InfoSection.styles";

type ActionButtonsProps = {
  shouldDepositNativeTokenAmount?: string;
  className?: string;
};

const InfoSection: FC<ActionButtonsProps> = ({
  shouldDepositNativeTokenAmount,
  className,
}) => {
  const { t } = useTranslation();

  const { nativeToken, wrappedNativeToken, ownedWrappedNativeTokenAmount } =
    useShouldDepositNativeTokenAmountInfo();

  if (shouldDepositNativeTokenAmount) {
    return (
      <Container className={className}>
        <InfoSubHeading>
          {t("orders.shouldDepositNativeTokenAmount", {
            wrappedNativeToken,
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

  return null;
};

export default InfoSection;
