import React, { FC, ReactElement } from "react";

import SideBar from "../SideBar/SideBar";
import { StyledPage, StyledSiteLogo } from "./Page.styles";

const Page: FC = ({ children }): ReactElement => {
  return (
    <StyledPage>
      <StyledSiteLogo />
      <SideBar open />
      {children}
    </StyledPage>
  );
};

export default Page;
