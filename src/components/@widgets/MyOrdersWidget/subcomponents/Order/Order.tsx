import React, { FC, PropsWithChildren, useMemo, useState } from "react";

import { compressFullOrderERC20, FullOrderERC20 } from "@airswap/utils";

import { getExpiryTranslation } from "../../../../../helpers/getExpiryTranslation";
import { getHumanReadableNumber } from "../../../../../helpers/getHumanReadableNumber";
import useCancelPending from "../../../../../hooks/useCancellationPending";
import useTokenInfo from "../../../../../hooks/useTokenInfo";
import { AppRoutes } from "../../../../../routes";
import { OrderStatus } from "../../../../../types/orderStatus";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { useOrderStatus } from "../../../OrderDetailWidget/hooks/useOrderStatus";
import {
  getOrderStatusTranslation,
  getTokenAmountWithDecimals,
} from "../../helpers";
import {
  ActionButton,
  ActionButtonContainer,
  Circle,
  Container,
  StatusIndicator,
  StyledNavLink,
  Text,
  TokenIcon,
  Tokens,
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
  const [orderStatus] = useOrderStatus(order);

  const [isHoveredActionButton, setIsHoveredActionButton] = useState(false);

  const senderAmount = useMemo(
    () =>
      getHumanReadableNumber(
        getTokenAmountWithDecimals(
          order.senderAmount,
          senderTokenInfo?.decimals
        ).toString()
      ),
    [order, senderTokenInfo]
  );

  const signerAmount = useMemo(
    () =>
      getHumanReadableNumber(
        getTokenAmountWithDecimals(
          order.signerAmount,
          signerTokenInfo?.decimals
        ).toString()
      ),
    [order, signerTokenInfo]
  );

  const timeLeft = useMemo(() => {
    const expiry = new Date(parseInt(order.expiry) * 1000);
    return getExpiryTranslation(new Date(), expiry);
  }, [order]);

  const orderString = useMemo(() => compressFullOrderERC20(order), [order]);
  const orderStatusTranslation = useMemo(
    () => getOrderStatusTranslation(orderStatus),
    [orderStatus]
  );

  const handleDeleteOrderButtonClick = () => {
    onDeleteOrderButtonClick(order);
    setIsHoveredActionButton(false);
  };

  const handleActionButtonMouseEnter = () => {
    setIsHoveredActionButton(true);
    onDeleteOrderButtonMouseEnter(index, orderStatus === OrderStatus.open);
  };

  const handleActionButtonMouseLeave = () => {
    setIsHoveredActionButton(false);
    onDeleteOrderButtonMouseLeave();
  };

  return (
    <Container orderStatus={orderStatus} className={className}>
      <StatusIndicator
        onMouseEnter={() => onStatusIndicatorMouseEnter(index, orderStatus)}
        onMouseLeave={onStatusIndicatorMouseLeave}
      >
        <Circle />
      </StatusIndicator>
      <Tokens>
        <TokenIcon logoURI={signerTokenInfo?.logoURI} />
        <TokenIcon logoURI={senderTokenInfo?.logoURI} />
      </Tokens>
      <Text>{`${signerAmount} ${signerTokenInfo?.symbol || ""}`}</Text>
      <Text>{`${senderAmount} ${senderTokenInfo?.symbol || ""}`}</Text>
      <Text>
        {orderStatus === OrderStatus.open ? timeLeft : orderStatusTranslation}
      </Text>
      <StyledNavLink
        $isHovered={isHoveredActionButton}
        to={`/${AppRoutes.order}/${orderString}`}
      />

      <ActionButtonContainer>
        {cancelInProgress ? (
          <LoadingSpinner />
        ) : (
          <ActionButton
            icon={orderStatus !== OrderStatus.open ? "bin" : "button-x"}
            iconSize={orderStatus === OrderStatus.open ? 0.5625 : 0.675}
            onClick={handleDeleteOrderButtonClick}
            onMouseEnter={handleActionButtonMouseEnter}
            onMouseLeave={handleActionButtonMouseLeave}
          />
        )}
      </ActionButtonContainer>
    </Container>
  );
};

export default Order;
