import React, { FC } from "react";

import MySwapsWidget from "../../components/MySwapsWidget/MySwapsWidget";
import { StyledPage } from "./MySwaps.styles";

const MySwapsPage: FC = () => {
  return (
    <StyledPage>
      <MySwapsWidget />
    </StyledPage>
  );
};

export default MySwapsPage;
