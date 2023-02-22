import React, { FC, PropsWithChildren, useMemo } from "react";

import { FullOrderERC20 } from "@airswap/typescript";
import { compressFullOrderERC20 } from "@airswap/utils";

import useCancelPending from "../../../../hooks/useCancellationPending";
import useTokenInfo from "../../../../hooks/useTokenInfo";
import { AppRoutes } from "../../../../routes";
import { OrderStatus } from "../../../../types/orderStatus";
import { getExpiryTranslation } from "../../../ExpiryIndicator/helpers";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";
import { useOrderStatus } from "../../../OrderDetailWidget/hooks/useOrderStatus";
import {
  ActionButton,
  ActionButtonContainer,
  Circle,
  Container,
  StatusIndicator,
  StyledNavLink,
  Text,
} from "./Order.styles";

interface OrderProps {
  order: FullOrderERC20;
  index: number;
  onDeleteOrderButtonClick: (order: FullOrderERC20) => void;
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
  const senderTokenInfo = useTokenInfo(order.senderToken);
  const signerTokenInfo = useTokenInfo(order.signerToken);
  const cancelInProgress = useCancelPending(order.nonce);
  const orderStatus = useOrderStatus(order);

  const timeLeft = useMemo(() => {
    const expiry = new Date(parseInt(order.expiry) * 1000);
    return getExpiryTranslation(new Date(), expiry);
  }, [order]);

  const orderString = useMemo(() => compressFullOrderERC20(order), [order]);

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
      <Text>{`${1} ${signerTokenInfo?.symbol || ""}`}</Text>
      <Text>{`${1} ${senderTokenInfo?.symbol || ""}`}</Text>
      <Text>{timeLeft || "orderStatusTranslation"}</Text>
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
