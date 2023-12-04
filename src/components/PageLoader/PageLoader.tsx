import { StyledPage } from "../Page/Page.styles";
import WidgetFrame from "../WidgetFrame/WidgetFrame";
import React, { FC, ReactElement } from "react";

const PageLoader: FC = (): ReactElement => {
  return (
    <StyledPage>
      <WidgetFrame />
    </StyledPage>
  );
};

export default PageLoader;
