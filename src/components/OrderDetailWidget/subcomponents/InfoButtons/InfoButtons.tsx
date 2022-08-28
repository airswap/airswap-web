import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/typescript";

import { BigNumber } from "bignumber.js";

import Icon from "../../../Icon/Icon";
import { RateField } from "../../../MakeWidget/subcomponents/RateField/RateField";
import {
  ButtonsWrapper,
  Container,
  StyledLargePillButton,
} from "./InfoButtons.styles";

type InfoButtonsProps = {
  ownerIsCurrentUser?: boolean;
  onFeeButtonClick: () => void;
  token1: string | null;
  token2: string | null;
  rate: BigNumber;
  className?: string;
};

const InfoButtons: FC<InfoButtonsProps> = ({
  ownerIsCurrentUser,
  onFeeButtonClick,
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
          <StyledLargePillButton>
            {t("orders.copyLink")}
            <Icon name="copy2" />
          </StyledLargePillButton>
        )}
      </ButtonsWrapper>
    </Container>
  );
};

export default InfoButtons;
