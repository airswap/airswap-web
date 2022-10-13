import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppErrorType } from "../../errors/appError";
import { cancelOrder } from "../../features/cancelOtc/cancelOtcActions";
import { reset } from "../../features/cancelOtc/cancelOtcSlice";
import {
  selectCancelOtcReducer,
  setErrors,
} from "../../features/cancelOtc/cancelOtcSlice";
import { selectTakeOtcReducer } from "../../features/takeOtc/takeOtcSlice";
import useCancellationPending from "../../hooks/useCancellationPending";
import { AppRoutes } from "../../routes";
import { OrderStatus } from "../../types/orderStatus";
import { ErrorList } from "../ErrorList/ErrorList";
import Icon from "../Icon/Icon";
import { useOrderStatus } from "../OrderDetailWidget/hooks/useOrderStatus";
import Overlay from "../Overlay/Overlay";
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
  const { activeOrder } = useAppSelector(selectTakeOtcReducer);
  const { cancelState, errors } = useAppSelector(selectCancelOtcReducer);
  const params = useParams<{ compressedOrder: string }>();
  const hasCancellationPending = useCancellationPending(activeOrder?.nonce!);
  const orderStatus = useOrderStatus(activeOrder!, chainId, library);

  const handleBackButtonClick = () => {
    history.goBack();
  };

  const handleCancelClick = async () => {
    await dispatch(
      cancelOrder({
        order: activeOrder!,
        chainId: chainId!,
        library: library,
      })
    );

    if (cancelState === "success") {
      history.push({
        pathname: `/${AppRoutes.order}/${params.compressedOrder}`,
      });
    }
  };

  const handleErrorListClose = () => {
    dispatch(reset());
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
          disabled={orderStatus === OrderStatus.taken}
          loading={cancelState === "in-progress"}
        >
          {t("orders.confirmCancel")}
        </CancelButton>
      </ButtonContainer>
      <Overlay
        title={t("validatorErrors.unableSwap")}
        subTitle={t("validatorErrors.swapFail")}
        onCloseButtonClick={handleErrorListClose}
        isHidden={!errors}
      >
        <ErrorList
          errors={errors ? [errors] : []}
          onBackButtonClick={handleErrorListClose}
        />
      </Overlay>
    </Container>
  );
};
