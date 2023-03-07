import React, { FC, PropsWithChildren, useMemo, useRef } from "react";

import { FullOrderERC20 } from "@airswap/typescript";
import { compressFullOrderERC20 } from "@airswap/utils";

import { getHumanReadableNumber } from "../../../../helpers/getHumanReadableNumber";
import useTokenInfo from "../../../../hooks/useTokenInfo";
import { AppRoutes } from "../../../../routes";
import { getTokenAmountWithDecimals } from "../../../MyOrdersWidget/helpers";
import { Container, StyledNavLink, Text } from "./Order.styles";

interface OrderProps {
  order: FullOrderERC20;
  index: number;
  onOrderLinkClick: () => void;
  invertRate?: boolean;
  className?: string;
}

const Order: FC<PropsWithChildren<OrderProps>> = ({
  order,
  index,
  onOrderLinkClick,
  invertRate,
  className,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const senderTokenInfo = useTokenInfo(order.senderToken);
  const signerTokenInfo = useTokenInfo(order.signerToken);

  const handleMouseOver = () => {
    console.log("hi");
  };

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
  const displayRate = useMemo(
    () =>
      getHumanReadableNumber(
        (parseFloat(senderAmount) / parseFloat(signerAmount)).toString()
      ),
    [senderAmount, signerAmount]
  );

  console.log(order);
  const orderString = useMemo(() => compressFullOrderERC20(order), [order]);

  return (
    <Container className={className}>
      <Text>{senderAmount}</Text>
      <Text>{signerAmount}</Text>
      <Text ref={tooltipRef} onMouseEnter={handleMouseOver}>
        {invertRate ? 1 / parseFloat(displayRate) : displayRate}
      </Text>
      <StyledNavLink
        onClick={onOrderLinkClick}
        to={`/${AppRoutes.order}/${orderString}`}
      />
    </Container>
  );
};

export default Order;
