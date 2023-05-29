import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../../../../app/hooks";
import { selectProtocolFee } from "../../../../features/metadata/metadataSlice";
import Icon from "../../../Icon/Icon";
import { RateField } from "../../../MakeWidget/subcomponents/RateField/RateField";
import {
  ButtonsWrapper,
  Container,
  StyledLargePillButton,
} from "./InfoButtons.styles";

type InfoButtonsProps = {
  isMakerOfSwap: boolean;
  token1?: string;
  token2?: string;
  rate: BigNumber;
  onFeeButtonClick: () => void;
  onCopyButtonClick: () => void;
  className?: string;
};

const InfoButtons: FC<InfoButtonsProps> = ({
  isMakerOfSwap,
  token1,
  token2,
  rate,
  onFeeButtonClick,
  onCopyButtonClick,
  className,
}) => {
  const { t } = useTranslation();
  const protocolFee = useAppSelector(selectProtocolFee);

  return (
    <Container className={className}>
      <ButtonsWrapper>
        {token1 && token2 && rate && (
          <RateField isButton token1={token1} token2={token2} rate={rate} />
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
      </ButtonsWrapper>
    </Container>
  );
};

export default InfoButtons;
