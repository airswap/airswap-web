import React, { FC } from "react";

import AvailableOrdersWidget from "../../components/AvailableOrdersWidget/AvailableOrdersWidget";
import { StyledPage } from "./AvailableOrders.styles";

const AvailableOrdersPage: FC = () => {
  return (
    <StyledPage>
      <AvailableOrdersWidget />
    </StyledPage>
  );
};

export default AvailableOrdersPage;
