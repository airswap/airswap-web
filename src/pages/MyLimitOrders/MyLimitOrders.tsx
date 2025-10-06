import React, { FC } from "react";

import MyLimitOrdersWidget from "../../components/@widgets/MyLimitOrdersWidget/MyLimitOrdersWidget";
import { Container } from "../MyOtcOrders/MyOtcOrders.styles";

const MyLimitOrdersPage: FC = () => {
  return (
    <Container>
      <MyLimitOrdersWidget />
    </Container>
  );
};

export default MyLimitOrdersPage;
