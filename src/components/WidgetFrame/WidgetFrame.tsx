import React, { FC, ReactElement } from "react";

import { WidgetFrameWrapper, StyledWidgetFrame } from "./WidgetFrame.styles";

type WidgetFrameType = {
  children?: React.ReactNode;
  isConnected?: boolean;
  isOverlayOpen?: boolean;
};

const WidgetFrame: FC<WidgetFrameType> = ({
  children,
  isConnected,
  isOverlayOpen,
}): ReactElement => {
  return (
    <StyledWidgetFrame
      $isConnected={isConnected}
      $isOverlayOpen={isOverlayOpen}
    >
      <WidgetFrameWrapper>{children}</WidgetFrameWrapper>
    </StyledWidgetFrame>
  );
};

export default WidgetFrame;
