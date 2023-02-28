import React, { FC, PropsWithChildren, useMemo } from "react";

import { FullOrderERC20 } from "@airswap/typescript";
import { compressFullOrderERC20 } from "@airswap/utils";

import useTokenInfo from "../../../../hooks/useTokenInfo";
import { AppRoutes } from "../../../../routes";
import { getExpiryTranslation } from "../../../ExpiryIndicator/helpers";
import { useOrderStatus } from "../../../OrderDetailWidget/hooks/useOrderStatus";
import { Container, StyledNavLink, Text } from "./Order.styles";

interface OrderProps {
  order: FullOrderERC20;
  index: number;
  className?: string;
}

const Order: FC<PropsWithChildren<OrderProps>> = ({
  order,
  index,
  className,
}) => {
  const senderTokenInfo = useTokenInfo(order.senderToken);
  const signerTokenInfo = useTokenInfo(order.signerToken);
  const orderStatus = useOrderStatus(order);

  const timeLeft = useMemo(() => {
    const expiry = new Date(parseInt(order.expiry) * 1000);
    return getExpiryTranslation(new Date(), expiry);
  }, [order]);

  const orderString = useMemo(() => compressFullOrderERC20(order), [order]);

  return (
    <Container orderStatus={orderStatus} className={className}>
      <Text>{`${1} ${signerTokenInfo?.symbol || ""}`}</Text>
      <Text>{`${1} ${senderTokenInfo?.symbol || ""}`}</Text>
      <Text>{timeLeft || "orderStatusTranslation"}</Text>
      <StyledNavLink to={`/${AppRoutes.order}/${orderString}`} />
    </Container>
  );
};

export default Order;
