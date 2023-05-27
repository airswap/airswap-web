import { FC, PropsWithChildren, useMemo } from "react";
import { useHistory } from "react-router-dom";

import { FullOrderERC20, OrderERC20 } from "@airswap/types";
import { compressFullOrderERC20 } from "@airswap/utils";

import { useAppDispatch } from "../../../../app/hooks";
import { setCurrentSearchAmount } from "../../../../features/indexer/indexerSlice";
import useTokenInfo from "../../../../hooks/useTokenInfo";
import { getTokenAmountWithDecimals } from "../../../MyOrdersWidget/helpers";
import { Container, Text } from "./Order.styles";

interface OrderProps {
  order: FullOrderERC20 | OrderERC20;
  index: number;
  onSwapLinkClick: () => void;
  onMouseEnter: (target: HTMLDivElement, index: number, shift: number) => void;
  onMouseLeave: () => void;
  searchAmount?: string;
  invertRate?: boolean;
  className?: string;
}

const Order: FC<PropsWithChildren<OrderProps>> = ({
  order,
  index,
  onSwapLinkClick,
  onMouseEnter,
  onMouseLeave,
  searchAmount,
  invertRate,
  className,
}) => {
  const history = useHistory();
  const dispatch = useAppDispatch();
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

  function isFullOrder(orderToCheck: any): orderToCheck is FullOrderERC20 {
    return orderToCheck.swapContract !== undefined;
  }

  const handleClick = () => {
    if (isFullOrder(order)) {
      if (searchAmount) {
        dispatch(setCurrentSearchAmount(searchAmount));
      }
      history.push({
        pathname: `/order/${compressFullOrderERC20(order)}`,
        state: { fromSwapFlow: true },
      });
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
