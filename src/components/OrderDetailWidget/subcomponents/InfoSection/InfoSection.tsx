import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import useShouldDepositNativeTokenAmountInfo from "../../../../hooks/useShouldDepositNativeTokenAmountInfo";
import { InfoSubHeading } from "../../../Typography/Typography";
import { getFullOrderERC20WarningTranslation } from "../../helpers";
import { Container, Strong } from "./InfoSection.styles";

type ActionButtonsProps = {
  isDifferentChainId: boolean;
  isExpired: boolean;
  isIntendedRecipient: boolean;
  isMakerOfSwap: boolean;
  isNotConnected: boolean;
  orderChainId: number;
  className?: string;
};

const InfoSection: FC<ActionButtonsProps> = ({
  isDifferentChainId,
  isExpired,
  isIntendedRecipient,
  isMakerOfSwap,
  isNotConnected,
  orderChainId,
  className,
}) => {
  const warningText = useMemo(() => {
    return getFullOrderERC20WarningTranslation(
      isDifferentChainId,
      isExpired,
      isIntendedRecipient,
      isMakerOfSwap,
      isNotConnected,
      orderChainId
    );
  }, [
    isDifferentChainId,
    isExpired,
    isIntendedRecipient,
    isMakerOfSwap,
    isNotConnected,
    orderChainId,
  ]);

  if (warningText) {
    return (
      <Container className={className}>
        <InfoSubHeading>{warningText}</InfoSubHeading>
      </Container>
    );
  }

  return null;
};

export default InfoSection;
