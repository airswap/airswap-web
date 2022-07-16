import React, { FC } from "react";

import { WidgetHeader } from "../../../../styled-components/WidgetHeader/WidgetHeader";
import ExpiryIndicator from "../../../ExpiryIndicator/ExpiryIndicator";
import { Title } from "../../../Typography/Typography";

type OrderDetailWidgetHeaderProps = {
  title: string;
};

const OrderDetailWidgetHeader: FC<OrderDetailWidgetHeaderProps> = ({
  title,
}) => {
  return (
    <WidgetHeader>
      <Title type="h2" as="h1">
        {title}
      </Title>
      <ExpiryIndicator expiry={new Date("2022-12-11T23:00:00")} />
    </WidgetHeader>
  );
};

export default OrderDetailWidgetHeader;
