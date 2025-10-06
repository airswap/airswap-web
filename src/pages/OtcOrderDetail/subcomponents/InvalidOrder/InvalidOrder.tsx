import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import Icon from "../../../../components/Icon/Icon";
import {
  InfoSubHeading,
  Title,
} from "../../../../components/Typography/Typography";
import { AppRoutes, routes } from "../../../../routes";
import {
  Container,
  StyledInfoHeading,
  Header,
  InfoContainer,
  BackButton,
} from "./InvalidOrder.styles";

const InvalidOrder: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleBackButtonClick = () => {
    history.push({ pathname: routes.makeOtcOrder() });
  };

  return (
    <Container>
      <InfoContainer>
        <Icon name="close-circle-outline" iconSize={4.5} />
        <StyledInfoHeading>
          {t("validatorErrors.invalidOrder")}
        </StyledInfoHeading>
        <InfoSubHeading>
          {t("validatorErrors.invalidOrderDescription")}
        </InfoSubHeading>
      </InfoContainer>
      <BackButton onClick={handleBackButtonClick}>
        {t("common.back")}
      </BackButton>
    </Container>
  );
};

export default InvalidOrder;
