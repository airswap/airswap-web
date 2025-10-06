import { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import Icon from "../../Icon/Icon";
import { InfoSubHeading, Title } from "../../Typography/Typography";
import {
  Container,
  InfoContainer,
  StyledActionButtons,
  StyledInfoHeading,
  StyledWidgetHeader,
} from "./CancelReview.styles";

interface CancelReviewProps {
  onBackButtonClick: () => void;
  onSignButtonClick: () => void;
  className?: string;
}

const CancelReview: FC<CancelReviewProps> = ({
  onBackButtonClick,
  onSignButtonClick,
  className = "",
}): ReactElement => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <StyledWidgetHeader>
        <Title type="h2" as="h1">
          {t("common.cancel")}
        </Title>
      </StyledWidgetHeader>

      <InfoContainer>
        <Icon name="close-circle-outline" iconSize={4.5} />

        <StyledInfoHeading>
          {t("orders.areYouSureYouWantToCancel")}
        </StyledInfoHeading>

        <InfoSubHeading>{t("orders.actionCannotBeReversed")}</InfoSubHeading>
      </InfoContainer>

      <StyledActionButtons
        backButtonText={t("common.back")}
        onEditButtonClick={onBackButtonClick}
        onSignButtonClick={onSignButtonClick}
      />
    </Container>
  );
};

export default CancelReview;
