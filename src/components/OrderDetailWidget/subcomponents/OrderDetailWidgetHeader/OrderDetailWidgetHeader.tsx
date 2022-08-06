import React, { FC } from "react";

import { Title } from "../../../Typography/Typography";
import {
  InfoContainer,
  StyledExpiryIndicator,
  StyledOrderRecipientInfo,
  StyledWidgetHeader,
} from "./OrderDetailWidgetHeader.styles";

type OrderDetailWidgetHeaderProps = {
  title: string;
  className?: string;
};

const OrderDetailWidgetHeader: FC<OrderDetailWidgetHeaderProps> = ({
  title,
  className,
}) => {
  return (
    <StyledWidgetHeader className={className}>
      <Title type="h2" as="h1">
        {title}
      </Title>
      <InfoContainer>
        <StyledOrderRecipientInfo
          type="address"
          address="0x000003443344343343443"
        />
        <StyledExpiryIndicator expiry={new Date("2022-12-11T23:00:00")} />
      </InfoContainer>
    </StyledWidgetHeader>
  );
};

export default OrderDetailWidgetHeader;
