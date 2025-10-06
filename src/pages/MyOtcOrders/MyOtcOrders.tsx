import React, { FC } from "react";

import MyOtcOrdersWidget from "../../components/@widgets/MyOtcOrdersWidget/MyOtcOrdersWidget";
import { Container } from "./MyOtcOrders.styles";

const MyOtcOrdersPage: FC = () => {
  return (
    <Container>
      <MyOtcOrdersWidget />
    </Container>
  );
};

export default MyOtcOrdersPage;
