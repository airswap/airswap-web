import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { OrderStatus } from "../../../../types/orderStatus";
import ExpiryIndicator from "../../../ExpiryIndicator/ExpiryIndicator";
import { Button, StyledIcon } from "./OrderStatusInfo.styles";

type OrderStatusInfoProps = {
  expiry: Date;
  link?: string;
  status: OrderStatus;
  className?: string;
};

const OrderStatusInfo: FC<OrderStatusInfoProps> = ({
  expiry,
  link,
  status,
  className,
}) => {
  const { t } = useTranslation();

  if (status === OrderStatus.open) {
    return <ExpiryIndicator expiry={expiry} className={className} />;
  }

  return (
    <Button as="a" href={link} target="_blank" className={className}>
      {status === OrderStatus.canceled && t("common.canceled")}
      {status === OrderStatus.taken && t("common.taken")}
      <StyledIcon iconSize={0.875} name="transaction-link" />
    </Button>
  );
};

export default OrderStatusInfo;
