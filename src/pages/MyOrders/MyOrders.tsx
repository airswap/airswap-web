import React, { FC } from "react";

import MyOrdersWidget from "../../components/@widgets/MyOrdersWidget/MyOrdersWidget";
import { StyledMyOrdersPage } from "./MyOrders.styles";

const MyOrdersPage: FC = () => {
  return (
    <StyledMyOrdersPage>
      <MyOrdersWidget />
    </StyledMyOrdersPage>
  );
};

export default MyOrdersPage;
