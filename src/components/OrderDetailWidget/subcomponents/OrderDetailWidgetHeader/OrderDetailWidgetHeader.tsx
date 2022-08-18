import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { OrderStatus } from "../../../../types/orderStatus";
import { OrderType } from "../../../../types/orderTypes";
import { Title } from "../../../Typography/Typography";
import {
  InfoContainer,
  StyledOrderRecipientInfo,
  StyledOrderStatusInfo,
  StyledWidgetHeader,
} from "./OrderDetailWidgetHeader.styles";

type OrderDetailWidgetHeaderProps = {
  expiry: Date;
  orderStatus: OrderStatus;
  orderType: OrderType;
  recipientAddress?: string;
  transactionLink?: string;
  userAddress?: string;
  className?: string;
};

const OrderDetailWidgetHeader: FC<OrderDetailWidgetHeaderProps> = ({
  expiry,
  orderStatus,
  orderType,
  recipientAddress,
  transactionLink,
  userAddress,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <StyledWidgetHeader className={className}>
      <Title type="h2" as="h1">
        {t("common.swap")}
      </Title>
      <InfoContainer>
        <StyledOrderRecipientInfo
          orderType={orderType}
          recipientAddress={recipientAddress}
          userAddress={userAddress}
        />
        <StyledOrderStatusInfo
          expiry={expiry}
          status={orderStatus}
          link={transactionLink}
        />
      </InfoContainer>
    </StyledWidgetHeader>
  );
};

export default OrderDetailWidgetHeader;
