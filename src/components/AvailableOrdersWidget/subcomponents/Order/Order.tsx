import { FC, PropsWithChildren, useMemo } from "react";
import { useHistory } from "react-router-dom";

import {
  compressFullOrderERC20,
  FullOrderERC20,
  OrderERC20,
} from "@airswap/utils";

import { getTokenDecimals } from "../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import useTokenInfo from "../../../../hooks/useTokenInfo";
import { getTokenAmountWithDecimals } from "../../../@widgets/MyOrdersWidget/helpers";
import { Container, Text } from "./Order.styles";

interface OrderProps {
  order: FullOrderERC20 | OrderERC20;
  index: number;
  onSwapLinkClick: () => void;
  onFullOrderLinkClick?: () => void;
  onMouseEnter: (target: HTMLDivElement, index: number, shift: number) => void;
  onMouseLeave: () => void;
  invertRate?: boolean;
  className?: string;
}

const Order: FC<PropsWithChildren<OrderProps>> = ({
  order,
  index,
  onSwapLinkClick,
  onFullOrderLinkClick,
  onMouseEnter,
  onMouseLeave,
  invertRate,
  className,
}) => {
  const history = useHistory();
  const senderTokenInfo = useTokenInfo(order.senderToken);
  const signerTokenInfo = useTokenInfo(order.signerToken);
  const senderTokenDecimals = senderTokenInfo
    ? getTokenDecimals(senderTokenInfo)
    : undefined;
  const signerTokenDecimals = signerTokenInfo
    ? getTokenDecimals(signerTokenInfo)
    : undefined;

  const senderAmount = useMemo(
    () =>
      getTokenAmountWithDecimals(
        order.senderAmount,
        senderTokenDecimals
      ).toString(),
    [order, senderTokenDecimals]
  );

  const signerAmount = useMemo(
    () =>
      getTokenAmountWithDecimals(
        order.signerAmount,
        signerTokenDecimals
      ).toString(),
    [order, signerTokenDecimals]
  );

  const displayRate = useMemo(
    () =>
      (
        parseFloat(invertRate ? signerAmount : senderAmount) /
        parseFloat(invertRate ? senderAmount : signerAmount)
      ).toString(),
    [invertRate, senderAmount, signerAmount]
  );

  function isFullOrder(orderToCheck: any): orderToCheck is FullOrderERC20 {
    return orderToCheck.swapContract !== undefined;
  }

  const handleClick = () => {
    if (isFullOrder(order)) {
      history.push({
        pathname: `/order/${compressFullOrderERC20(order)}`,
      });
      onFullOrderLinkClick?.();
    } else {
      onSwapLinkClick();
    }
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
