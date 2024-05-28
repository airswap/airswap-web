import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import useShouldDepositNativeTokenAmountInfo from "../../../../../hooks/useShouldDepositNativeTokenAmountInfo";
import { InfoSubHeading } from "../../../../Typography/Typography";
import {
  StyledInfoHeading,
  StyledInfoSubHeading,
} from "../../../../Typography/Typography.styles";
import { getFullOrderERC20WarningTranslation } from "../../helpers";
import { Container, Strong } from "./InfoSection.styles";

type ActionButtonsProps = {
  isAllowancesFailed: boolean;
  isDifferentChainId: boolean;
  isExpired: boolean;
  isIntendedRecipient: boolean;
  isMakerOfSwap: boolean;
  isNotConnected: boolean;
  orderChainId: number;
  className?: string;
};

const InfoSection: FC<ActionButtonsProps> = ({
  isAllowancesFailed,
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
      isAllowancesFailed,
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
        <StyledInfoHeading>{warningText.heading}</StyledInfoHeading>

        {warningText.subHeading && (
          <StyledInfoSubHeading>{warningText.subHeading}</StyledInfoSubHeading>
        )}
      </Container>
    );
  }

  return null;
};

export default InfoSection;
