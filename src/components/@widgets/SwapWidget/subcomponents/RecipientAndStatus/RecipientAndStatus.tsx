import { FC } from "react";
import { useTranslation } from "react-i18next";

import { ADDRESS_ZERO } from "@airswap/utils";

import truncateEthAddress from "truncate-eth-address";

import { OrderStatus } from "../../../../../types/orderStatus";
import { OrderType } from "../../../../../types/orderTypes";
import OrderRecipientInfo from "../../../OrderDetailWidget/subcomponents/OrderRecipientInfo/OrderRecipientInfo";
import {
  Container,
  Recipient,
  StyledInfoSectionHeading,
  StyledOrderStatusInfo,
} from "./RecipientAndStatus.styles";

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
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <OrderRecipientInfo
        orderType={orderType}
        recipientAddress={recipient}
        userAddress={userAddress}
      />

      <StyledOrderStatusInfo
        isLoading={isLoading}
        expiry={expiry}
        link={link}
        status={status}
      />
    </Container>
  );
};
