import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { useToggle } from "@react-hookz/web/esm";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch } from "../../app/hooks";
import { useAppSelector } from "../../app/hooks";
import { AppError } from "../../errors/appError";
import { cancelOrder } from "../../features/takeOtc/takeOtcActions";
import {
  selectTakeOtcReducer,
  setStatus,
} from "../../features/takeOtc/takeOtcSlice";
import { ErrorList } from "../ErrorList/ErrorList";
import Icon from "../Icon/Icon";
import { InfoSubHeading, Title } from "../Typography/Typography";
import {
  Container,
  StyledInfoHeading,
  Header,
  InfoContainer,
  ButtonContainer,
  BackButton,
  CancelButton,
} from "./CancelWidget.styles";

export const CancelWidget = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { chainId, library } = useWeb3React();
  const { activeOrder } = useAppSelector(selectTakeOtcReducer);
  const params = useParams<{ compressedOrder: string }>();

  const handleBackButtonClick = () => {
    history.goBack();
  };

  const handleCancelClick = async () => {
    try {
      await cancelOrder(activeOrder!, chainId!, library);
      history.push({ pathname: `/order/${params.compressedOrder}` });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <Header>
        <Title type="h2" as="h1">
          {t("orders.cancelSwap")}
        </Title>
      </Header>
      <InfoContainer>
        <Icon name="close-circle-outline" iconSize={4.5} />
        <StyledInfoHeading>
          {t("orders.areYouSureYouWantToCancel")}
        </StyledInfoHeading>
        <InfoSubHeading>{t("orders.actionCannotBeReversed")}</InfoSubHeading>
      </InfoContainer>
      <ButtonContainer>
        <BackButton onClick={handleBackButtonClick}>
          {t("common.back")}
        </BackButton>
        <CancelButton intent={"primary"} onClick={handleCancelClick}>
          {t("orders.confirmCancel")}
        </CancelButton>
      </ButtonContainer>
    </Container>
  );
};
