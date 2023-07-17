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
  StyledCopyLinkButton,
  StyledLargePillButton,
} from "./InfoButtons.styles";

type InfoButtonsProps = {
  isMakerOfSwap: boolean;
  showViewAllQuotes: boolean;
  token1?: string;
  token2?: string;
  rate: BigNumber;
  onViewAllQuotesButtonClick: () => void;
  onFeeButtonClick: () => void;
  className?: string;
};

const InfoButtons: FC<InfoButtonsProps> = ({
  isMakerOfSwap,
  showViewAllQuotes,
  token1,
  token2,
  rate,
  onViewAllQuotesButtonClick,
  onFeeButtonClick,
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
        {isMakerOfSwap && <StyledCopyLinkButton />}
        {showViewAllQuotes && (
          <StyledLargePillButton onClick={onViewAllQuotesButtonClick}>
            {t("orders.viewAllQuotes")}
            <Icon name="chevron-down" />
          </StyledLargePillButton>
        )}
      </ButtonsWrapper>
    </Container>
  );
};

export default InfoButtons;
