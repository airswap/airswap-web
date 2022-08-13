import React, { FC } from "react";

import MakeWidget from "../../components/MakeWidget/MakeWidget";
import { StyledPage } from "./Make.styles";

const MakePage: FC = () => {
  return (
    <StyledPage>
      <MakeWidget />
    </StyledPage>
  );
};

export default MakePage;
