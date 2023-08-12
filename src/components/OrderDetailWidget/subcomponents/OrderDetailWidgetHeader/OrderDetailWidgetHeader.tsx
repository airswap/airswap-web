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
  isMakerOfSwap: boolean;
  isOrderStatusLoading: boolean;
  expiry: Date;
  orderStatus: OrderStatus;
  orderType: OrderType;
  recipientAddress?: string;
  transactionLink?: string;
  userAddress?: string;
  className?: string;
};

const OrderDetailWidgetHeader: FC<OrderDetailWidgetHeaderProps> = ({
  isMakerOfSwap,
  isOrderStatusLoading,
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
        {isMakerOfSwap ? t("common.order") : t("common.otc")}
      </Title>
      <InfoContainer>
        <StyledOrderRecipientInfo
          orderType={orderType}
          recipientAddress={recipientAddress}
          userAddress={userAddress}
        />
        <StyledOrderStatusInfo
          isLoading={isOrderStatusLoading}
          expiry={expiry}
          status={orderStatus}
          link={transactionLink}
        />
      </InfoContainer>
    </StyledWidgetHeader>
  );
};

export default OrderDetailWidgetHeader;
