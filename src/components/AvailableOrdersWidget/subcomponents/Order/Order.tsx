import React, { FC, PropsWithChildren, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { FullOrderERC20 } from "@airswap/types";
import { compressFullOrderERC20 } from "@airswap/utils";

import BigNumber from "bignumber.js";

import { getHumanReadableNumber } from "../../../../helpers/getHumanReadableNumber";
import useTokenInfo from "../../../../hooks/useTokenInfo";
import { AppRoutes } from "../../../../routes";
import { getTokenAmountWithDecimals } from "../../../MyOrdersWidget/helpers";
import { Container, Text } from "./Order.styles";

interface OrderProps {
  order: FullOrderERC20;
  index: number;
  onOrderLinkClick: () => void;
  onMouseEnter: (target: HTMLDivElement, index: number, shift: number) => void;
  onMouseLeave: () => void;
  invertRate?: boolean;
  className?: string;
}

const Order: FC<PropsWithChildren<OrderProps>> = ({
  order,
  index,
  onOrderLinkClick,
  onMouseEnter,
  onMouseLeave,
  invertRate,
  className,
}) => {
  const history = useHistory();
  const senderTokenInfo = useTokenInfo(order.senderToken);
  const signerTokenInfo = useTokenInfo(order.signerToken);

  const senderAmount = useMemo(
    () =>
      getTokenAmountWithDecimals(
        order.senderAmount,
        senderTokenInfo?.decimals
      ).toString(),
    [order, senderTokenInfo]
  );

  const signerAmount = useMemo(
    () =>
      getTokenAmountWithDecimals(
        order.signerAmount,
        signerTokenInfo?.decimals
      ).toString(),
    [order, signerTokenInfo]
  );
  const displayRate = useMemo(
    () =>
      (
        parseFloat(invertRate ? signerAmount : senderAmount) /
        parseFloat(invertRate ? senderAmount : signerAmount)
      ).toString(),
    [invertRate, senderAmount, signerAmount]
  );

  const orderString = useMemo(() => compressFullOrderERC20(order), [order]);

  const handleClick = () => {
    history.push(orderString);
    onOrderLinkClick();
  };

  return (
    <Container className={className} onClick={handleClick}>
      <Text
        onMouseEnter={(e) => onMouseEnter(e.currentTarget, index, 0)}
        onMouseLeave={onMouseLeave}
      >
        {senderAmount}
      </Text>
      <Text
        onMouseEnter={(e) => onMouseEnter(e.currentTarget, index, 1)}
        onMouseLeave={onMouseLeave}
      >
        {signerAmount}
      </Text>
      <Text
        onMouseEnter={(e) => onMouseEnter(e.currentTarget, index, 2)}
        onMouseLeave={onMouseLeave}
      >
        {displayRate}
      </Text>
    </Container>
  );
};

export default Order;
