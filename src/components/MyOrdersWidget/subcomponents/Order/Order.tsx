import React, { FC, PropsWithChildren, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { FullOrder } from "@airswap/typescript";
import { compressFullOrder } from "@airswap/utils";

import { compareAsc } from "date-fns";

import useCancelPending from "../../../../hooks/useCancellationPending";
import useTokenInfo from "../../../../hooks/useTokenInfo";
import { AppRoutes } from "../../../../routes";
import { OrderStatus } from "../../../../types/orderStatus";
import { getExpiryTranslation } from "../../../ExpiryIndicator/helpers";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";
import { useOrderStatus } from "../../../OrderDetailWidget/hooks/useOrderStatus";
import { getTokenAmountWithDecimals } from "../../helpers";
import {
  ActionButton,
  ActionButtonContainer,
  Circle,
  Container,
  StatusIndicator,
  StyledNavLink,
  StyledTokenLogo,
  Text,
  TokenLogos,
} from "./Order.styles";

interface OrderProps {
  order: FullOrder;
  index: number;
  onDeleteOrderButtonClick: (order: FullOrder) => void;
  onDeleteOrderButtonMouseEnter: (index: number, orderIsOpen: boolean) => void;
  onDeleteOrderButtonMouseLeave: () => void;
  onStatusIndicatorMouseEnter: (index: number, status: OrderStatus) => void;
  onStatusIndicatorMouseLeave: () => void;
  className?: string;
}

const Order: FC<PropsWithChildren<OrderProps>> = ({
  order,
  index,
  onDeleteOrderButtonClick,
  onDeleteOrderButtonMouseEnter,
  onDeleteOrderButtonMouseLeave,
  onStatusIndicatorMouseEnter,
  onStatusIndicatorMouseLeave,
  className,
}) => {
  const { t } = useTranslation();
  const senderTokenInfo = useTokenInfo(order.senderToken);
  const signerTokenInfo = useTokenInfo(order.signerToken);
  const cancelInProgress = useCancelPending(order.nonce);
  const orderStatus = useOrderStatus(order);

  const senderAmount = useMemo(
    () =>
      getTokenAmountWithDecimals(order.senderAmount, senderTokenInfo?.decimals),
    [order, senderTokenInfo]
  );

  const signerAmount = useMemo(
    () =>
      getTokenAmountWithDecimals(order.signerAmount, signerTokenInfo?.decimals),
    [order, signerTokenInfo]
  );

  const timeLeft = useMemo(() => {
    const expiry = new Date(parseInt(order.expiry) * 1000);
    return getExpiryTranslation(new Date(), expiry, t);
  }, [order, t]);

  const orderString = useMemo(() => compressFullOrder(order), [order]);

  const handleDeleteOrderButtonClick = () => {
    onDeleteOrderButtonClick(order);
  };

  return (
    <Container orderStatus={orderStatus} className={className}>
      <StatusIndicator
        onMouseEnter={() => onStatusIndicatorMouseEnter(index, orderStatus)}
        onMouseLeave={onStatusIndicatorMouseLeave}
      >
        <Circle />
      </StatusIndicator>
      <TokenLogos>
        <StyledTokenLogo size="tiny" tokenInfo={signerTokenInfo} />
        <StyledTokenLogo size="tiny" tokenInfo={senderTokenInfo} />
      </TokenLogos>
      <Text>{`${signerAmount} ${signerTokenInfo?.symbol || ""}`}</Text>
      <Text>{`${senderAmount} ${senderTokenInfo?.symbol || ""}`}</Text>
      <Text>{timeLeft || t("common.expired")}</Text>
      <StyledNavLink to={`/${AppRoutes.order}/${orderString}`} />

      <ActionButtonContainer>
        {cancelInProgress ? (
          <LoadingSpinner />
        ) : (
          <ActionButton
            icon={orderStatus !== OrderStatus.open ? "bin" : "button-x"}
            iconSize={orderStatus === OrderStatus.open ? 0.75 : 0.675}
            onClick={handleDeleteOrderButtonClick}
            onMouseEnter={() =>
              onDeleteOrderButtonMouseEnter(
                index,
                orderStatus === OrderStatus.open
              )
            }
            onMouseLeave={onDeleteOrderButtonMouseLeave}
          />
        )}
      </ActionButtonContainer>
    </Container>
  );
};

export default Order;
