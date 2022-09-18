import React, { FC } from "react";

import MyOrdersWidget from "../../components/MyOrdersWidget/MyOrdersWidget";
import { StyledPage } from "./MyOrders.styles";

const MySwapsPage: FC = () => {
  return (
    <StyledPage>
      <MyOrdersWidget />
    </StyledPage>
  );
};

export default MySwapsPage;
