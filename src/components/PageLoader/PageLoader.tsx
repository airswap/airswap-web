import React, { FC, ReactElement } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectUserSettings } from "../../features/userSettings/userSettingsSlice";
import useWindowSize from "../../helpers/useWindowSize";
import { StyledPage } from "../Page/Page.styles";
import WidgetFrame from "../WidgetFrame/WidgetFrame";

const PageLoader: FC = (): ReactElement => {
  const { showBookmarkWarning } = useAppSelector(selectUserSettings);
  const { width } = useWindowSize();
  /* using 480 from breakpoint size defined at src/style/breakpoints.ts */
  const adjustForBookmarkWarning = width! > 800 && showBookmarkWarning;

  return (
    <StyledPage adjustForBookmarkWarning={adjustForBookmarkWarning}>
      <WidgetFrame />
    </StyledPage>
  );
};

export default PageLoader;
