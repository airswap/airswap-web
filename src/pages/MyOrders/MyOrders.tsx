import React, { FC } from "react";

import MyOrdersWidget from "../../components/MyOrdersWidget/MyOrdersWidget";
import { StyledPage } from "./MyOrders.styles";

const MyOrdersPage: FC = () => {
  return (
    <StyledPage>
      <MyOrdersWidget />
    </StyledPage>
  );
};

export default MyOrdersPage;
