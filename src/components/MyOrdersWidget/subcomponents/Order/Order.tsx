import React, { FC, PropsWithChildren, useMemo } from "react";

import { FullOrder } from "@airswap/typescript";
import { compressFullOrder } from "@airswap/utils";

import { format } from "date-fns";

import useCancelPending from "../../../../hooks/useCancelPending";
import useTokenInfo from "../../../../hooks/useTokenInfo";
import { AppRoutes } from "../../../../routes";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";
import { getTokenAmountWithDecimals } from "../../helpers";
import {
  Circle,
  Container,
  StyledTokenLogo,
  TokenLogos,
  Text,
  ActiveIndicator,
  ActionButtonContainer,
  ActionButton,
  StyledNavLink,
} from "./Order.styles";

interface OrderProps {
  order: FullOrder;
  index: number;
  onDeleteOrderButtonClick: (order: FullOrder) => void;
  onDeleteOrderButtonMouseEnter: (index: number, isExpired: boolean) => void;
  onDeleteOrderButtonMouseLeave: () => void;
  className?: string;
}

const Order: FC<PropsWithChildren<OrderProps>> = ({
  order,
  index,
  onDeleteOrderButtonClick,
  onDeleteOrderButtonMouseEnter,
  onDeleteOrderButtonMouseLeave,
  className,
}) => {
  const senderTokenInfo = useTokenInfo(order.senderToken);
  const signerTokenInfo = useTokenInfo(order.signerToken);
  const cancelInProgress = useCancelPending(order.nonce);

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
  const expiry = useMemo(() => parseInt(order.expiry) * 1000, [order]);
  const orderString = useMemo(() => compressFullOrder(order), [order]);
  const isExpired = new Date().getTime() > expiry;

  const handleDeleteOrderButtonClick = () => {
    onDeleteOrderButtonClick(order);
  };

  return (
    <Container isExpired={isExpired} className={className}>
      <ActiveIndicator>
        <Circle />
      </ActiveIndicator>
      <TokenLogos>
        <StyledTokenLogo size="tiny" tokenInfo={signerTokenInfo} />
        <StyledTokenLogo size="tiny" tokenInfo={senderTokenInfo} />
      </TokenLogos>
      <Text>{`${signerAmount} ${signerTokenInfo?.symbol || ""}`}</Text>
      <Text>{`${senderAmount} ${senderTokenInfo?.symbol || ""}`}</Text>
      <Text>{format(expiry, "dd-MM-yyyy kk:mm")}</Text>
      <StyledNavLink to={`/${AppRoutes.order}/${orderString}`} />

      <ActionButtonContainer>
        {cancelInProgress ? (
          <LoadingSpinner />
        ) : (
          <ActionButton
            icon={`${isExpired ? "bin" : "button-x"}`}
            iconSize={0.75}
            onClick={handleDeleteOrderButtonClick}
            onMouseEnter={() => onDeleteOrderButtonMouseEnter(index, isExpired)}
            onMouseLeave={onDeleteOrderButtonMouseLeave}
          />
        )}
      </ActionButtonContainer>
    </Container>
  );
};

export default Order;
