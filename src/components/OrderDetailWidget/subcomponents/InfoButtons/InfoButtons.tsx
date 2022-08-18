import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import Icon from "../../../Icon/Icon";
import { Container, StyledLargePillButton } from "./InfoButtons.styles";

type InfoButtonsProps = {
  ownerIsCurrentUser?: boolean;
  className?: string;
};

const InfoButtons: FC<InfoButtonsProps> = ({
  ownerIsCurrentUser,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      {ownerIsCurrentUser && (
        <StyledLargePillButton>
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
    </Container>
  );
};

export default InfoButtons;
