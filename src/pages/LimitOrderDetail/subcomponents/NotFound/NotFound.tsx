import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import Icon from "../../../../components/Icon/Icon";
import { InfoSubHeading } from "../../../../components/Typography/Typography";
import { routes } from "../../../../routes";
import {
  Container,
  StyledInfoHeading,
  InfoContainer,
  BackButton,
  StyledInfoSubHeading,
} from "./NotFound.styles";

const NotFound: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleBackButtonClick = () => {
    history.push({ pathname: routes.makeLimitOrder() });
  };

  return (
    <Container>
      <InfoContainer>
        <Icon name="close-circle-outline" iconSize={4.5} />
        <StyledInfoHeading>
          {t("validatorErrors.delegateRuleNotFound")}
        </StyledInfoHeading>
        <StyledInfoSubHeading>
          {t("validatorErrors.delegateRuleNotFoundDescription")}
        </StyledInfoSubHeading>
      </InfoContainer>
      <BackButton onClick={handleBackButtonClick}>
        {t("common.back")}
      </BackButton>
    </Container>
  );
};

export default NotFound;
