import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../../../../app/hooks";
import { selectProtocolFee } from "../../../../features/metadata/metadataSlice";
import Icon from "../../../Icon/Icon";
import { RateField } from "../../../MakeWidget/subcomponents/RateField/RateField";
import { getFullOrderERC20WarningTranslation } from "../../helpers";
import {
  ButtonsWrapper,
  Container,
  InfoText,
  StyledLargePillButton,
} from "./InfoButtons.styles";

type InfoButtonsProps = {
  isDifferentChainId: boolean;
  isExpired: boolean;
  isIntendedRecipient: boolean;
  isMakerOfSwap: boolean;
  isNotConnected: boolean;
  orderChainId: number;
  token1?: string;
  token2?: string;
  rate: BigNumber;
  onFeeButtonClick: () => void;
  onCopyButtonClick: () => void;
  onViewAllQuotesButtonClick: () => void;
  className?: string;
};

const InfoButtons: FC<InfoButtonsProps> = ({
  isDifferentChainId,
  isExpired,
  isIntendedRecipient,
  isMakerOfSwap,
  isNotConnected,
  orderChainId,
  token1,
  token2,
  rate,
  onFeeButtonClick,
  onCopyButtonClick,
  onViewAllQuotesButtonClick,
  className,
}) => {
  const { t } = useTranslation();
  const protocolFee = useAppSelector(selectProtocolFee);

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

  return (
    <Container className={className}>
      <ButtonsWrapper isColumn={!isMakerOfSwap}>
        {token1 && token2 && rate && (
          <RateField isButton token1={token1} token2={token2} rate={rate} />
        )}
        {!isMakerOfSwap && !isNotConnected && (
          <StyledLargePillButton onClick={onViewAllQuotesButtonClick}>
            {t("orders.viewAllQuotes")}
            <Icon name="chevron-down" />
          </StyledLargePillButton>
        )}
        {isMakerOfSwap && (
          <StyledLargePillButton onClick={onFeeButtonClick}>
            {`${t("common.fee")} ${protocolFee / 100}%`}
            <Icon name="information-circle-outline" />
          </StyledLargePillButton>
        )}
        {isMakerOfSwap && (
          <StyledLargePillButton onClick={onCopyButtonClick}>
            {t("orders.copyLink")}
            <Icon name="copy2" />
          </StyledLargePillButton>
        )}
        {warningText && <InfoText>{warningText}</InfoText>}
      </ButtonsWrapper>
    </Container>
  );
};

export default InfoButtons;
