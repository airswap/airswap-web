import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { removeUserOrder } from "../../features/myOrders/myOrdersSlice";
import { cancelOrder } from "../../features/takeOtc/takeOtcActions";
import { selectTakeOtcReducer } from "../../features/takeOtc/takeOtcSlice";
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
  const dispatch = useAppDispatch();
  const { activeOrder } = useAppSelector(selectTakeOtcReducer);
  const params = useParams<{ compressedOrder: string }>();

  const handleBackButtonClick = () => {
    history.goBack();
  };

  const handleCancelClick = async () => {
    try {
      await dispatch(
        cancelOrder({
          order: activeOrder!,
          chainId: chainId!,
          library: library,
        })
      );
      history.push({ pathname: `/order/${params.compressedOrder}` });
    } catch (e) {
      console.error(e);
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
