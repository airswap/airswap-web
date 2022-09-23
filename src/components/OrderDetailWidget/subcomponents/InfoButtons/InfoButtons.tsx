import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { BigNumber } from "bignumber.js";

import Icon from "../../../Icon/Icon";
import { RateField } from "../../../MakeWidget/subcomponents/RateField/RateField";
import {
  ButtonsWrapper,
  Container,
  InfoText,
  StyledLargePillButton,
} from "./InfoButtons.styles";

type InfoButtonsProps = {
  ownerIsCurrentUser?: boolean;
  isIntendedRecipient: boolean;
  isExpired: boolean;
  onFeeButtonClick: () => void;
  onCopyButtonClick: () => void;
  token1: string;
  token2: string;
  rate: BigNumber;
  className?: string;
};

const InfoButtons: FC<InfoButtonsProps> = ({
  ownerIsCurrentUser,
  isIntendedRecipient,
  isExpired,
  onFeeButtonClick,
  onCopyButtonClick,
  className,
  token1,
  token2,
  rate,
}) => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <ButtonsWrapper>
        <RateField isButton token1={token1} token2={token2} rate={rate} />
        {ownerIsCurrentUser && (
          <StyledLargePillButton onClick={onFeeButtonClick}>
            {`${t("common.fee")} 0.7%`}
            <Icon name="information-circle-outline" />
          </StyledLargePillButton>
        )}
        {ownerIsCurrentUser && (
          <StyledLargePillButton onClick={onCopyButtonClick}>
            {t("orders.copyLink")}
            <Icon name="copy2" />
          </StyledLargePillButton>
        )}
        {!isIntendedRecipient && !ownerIsCurrentUser && (
          <InfoText>
            {isExpired
              ? t("orders.thisSwapWasNotForTheConnectedWallet")
              : t("orders.thisSwapIsNotForTheConnectedWallet")}
          </InfoText>
        )}
      </ButtonsWrapper>
    </Container>
  );
};

export default InfoButtons;
