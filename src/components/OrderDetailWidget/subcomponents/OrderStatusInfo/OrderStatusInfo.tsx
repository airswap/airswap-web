import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { OrderStatus } from "../../../../types/orderStatus";
import ExpiryIndicator from "../../../ExpiryIndicator/ExpiryIndicator";
import {
  Button,
  InfoWrapper,
  StyledIcon,
  StyledLoadingSpinner,
} from "./OrderStatusInfo.styles";

type OrderStatusInfoProps = {
  isLoading?: boolean;
  expiry: Date;
  link?: string;
  status: OrderStatus;
  className?: string;
};

const OrderStatusInfo: FC<OrderStatusInfoProps> = ({
  isLoading = false,
  expiry,
  link,
  status,
  className,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <InfoWrapper className={className}>
        <StyledLoadingSpinner />
      </InfoWrapper>
    );
  }

  if (status === OrderStatus.open || status === OrderStatus.expired) {
    return <ExpiryIndicator expiry={expiry} className={className} />;
  }

  if (!link) {
    return (
      <InfoWrapper className={className}>
        {status === OrderStatus.canceled && t("common.canceled")}
        {status === OrderStatus.taken && t("common.taken")}
      </InfoWrapper>
    );
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
