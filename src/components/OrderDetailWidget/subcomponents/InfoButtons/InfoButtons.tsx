import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { BigNumber } from "bignumber.js";

import Icon from "../../../Icon/Icon";
import { RateField } from "../../../MakeWidget/subcomponents/RateField/RateField";
import { getFullOrderWarningTranslation } from "../../helpers";
import {
  ButtonsWrapper,
  Container,
  InfoText,
  StyledLargePillButton,
} from "./InfoButtons.styles";

type InfoButtonsProps = {
  isExpired: boolean;
  isMakerOfSwap: boolean;
  isIntendedRecipient: boolean;
  isNotConnected: boolean;
  token1?: string;
  token2?: string;
  rate: BigNumber;
  onFeeButtonClick: () => void;
  onCopyButtonClick: () => void;
  className?: string;
};

const InfoButtons: FC<InfoButtonsProps> = ({
  isMakerOfSwap,
  isIntendedRecipient,
  isExpired,
  isNotConnected,
  onFeeButtonClick,
  onCopyButtonClick,
  className,
  token1,
  token2,
  rate,
}) => {
  const { t } = useTranslation();

  const warningText = useMemo(() => {
    return getFullOrderWarningTranslation(
      isExpired,
      isMakerOfSwap,
      isIntendedRecipient,
      isNotConnected
    );
  }, [isExpired, isMakerOfSwap, isIntendedRecipient, isNotConnected]);

  return (
    <Container className={className}>
      <ButtonsWrapper>
        {token1 && token2 && rate && (
          <RateField isButton token1={token1} token2={token2} rate={rate} />
        )}
        {isMakerOfSwap && (
          <StyledLargePillButton onClick={onFeeButtonClick}>
            {`${t("common.fee")} 0.7%`}
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
