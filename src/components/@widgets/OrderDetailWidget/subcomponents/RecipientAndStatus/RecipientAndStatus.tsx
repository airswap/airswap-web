import { FC } from "react";

import { OrderStatus } from "../../../../../types/orderStatus";
import { OrderType } from "../../../../../types/orderTypes";
import OrderRecipientInfo from "../OrderRecipientInfo/OrderRecipientInfo";
import { Container, StyledOrderStatusInfo } from "./RecipientAndStatus.styles";

interface RecipientAndStatusProps {
  isLoading?: boolean;
  expiry: Date;
  link?: string;
  orderType: OrderType;
  recipient?: string;
  status: OrderStatus;
  userAddress?: string;
  className?: string;
}

export const RecipientAndStatus: FC<RecipientAndStatusProps> = ({
  isLoading = false,
  expiry,
  link,
  recipient,
  status,
  orderType,
  userAddress,
  className,
}) => {
  return (
    <Container isTaken={status === OrderStatus.taken} className={className}>
      {status !== OrderStatus.taken && (
        <OrderRecipientInfo
          orderType={orderType}
          recipientAddress={recipient}
          userAddress={userAddress}
        />
      )}

      <StyledOrderStatusInfo
        isLoading={isLoading}
        expiry={expiry}
        link={link}
        status={status}
      />
    </Container>
  );
};
