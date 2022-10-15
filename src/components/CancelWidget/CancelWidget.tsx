import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { cancelOrder } from "../../features/takeOtc/takeOtcActions";
import { selectTakeOtcReducer } from "../../features/takeOtc/takeOtcSlice";
import useCancellationPending from "../../hooks/useCancellationPending";
import { AppRoutes } from "../../routes";
import { OrderStatus } from "../../types/orderStatus";
import Icon from "../Icon/Icon";
import { useOrderStatus } from "../OrderDetailWidget/hooks/useOrderStatus";
import { Title } from "../Typography/Typography";
import { InfoSubHeading } from "../Typography/Typography";
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
  const { status, activeOrder } = useAppSelector(selectTakeOtcReducer);
  const params = useParams<{ compressedOrder: string }>();
  const orderStatus = useOrderStatus();
  const cancelInProgress = useCancellationPending(activeOrder!.nonce);
  const wrongChainId = useMemo(() => {
    return chainId?.toString() !== activeOrder!.chainId;
  }, [chainId, activeOrder]);
  const isExpired = new Date().getTime() > parseInt(activeOrder!.expiry) * 1000;

  const handleBackButtonClick = () => {
    history.goBack();
  };

  useMemo(() => {
    if (status === "canceled") {
      history.push({
        pathname: `/${AppRoutes.order}/${params.compressedOrder}`,
      });
    }
  }, [history, params, status]);

  const handleCancelClick = async () => {
    await dispatch(
      cancelOrder({
        order: activeOrder!,
        chainId: chainId!,
        library: library,
      })
    );
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
        <CancelButton
          intent={"primary"}
          onClick={handleCancelClick}
          disabled={
            orderStatus === OrderStatus.taken || wrongChainId || isExpired
          }
          loading={cancelInProgress}
        >
          {t("orders.confirmCancel")}
        </CancelButton>
      </ButtonContainer>
    </Container>
  );
};
