import React, { FC, ReactElement } from "react";

import { StyledPage } from "../Page/Page.styles";
import WidgetFrame from "../WidgetFrame/WidgetFrame";

const PageLoader: FC = (): ReactElement => {
  return (
    <StyledPage>
      <WidgetFrame />
    </StyledPage>
  );
};

export default PageLoader;
