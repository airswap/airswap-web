import React, { FC } from "react";

import MyOrdersWidget from "../../components/MyOrdersWidget/MyOrdersWidget";
import { StyledPage } from "./MySwaps.styles";

const MySwapsPage: FC = () => {
  return (
    <StyledPage>
      <MyOrdersWidget />
    </StyledPage>
  );
};

export default MySwapsPage;
