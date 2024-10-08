import React, { FC, ReactElement } from "react";

import { WidgetFrameWrapper, StyledWidgetFrame } from "./WidgetFrame.styles";

type WidgetFrameType = {
  children?: React.ReactNode;
  isConnected?: boolean;
  isOpen?: boolean;
  isOverlayOpen?: boolean;
};

const WidgetFrame: FC<WidgetFrameType> = ({
  children,
  isOpen,
  isConnected,
  isOverlayOpen,
}): ReactElement => {
  return (
    <StyledWidgetFrame
      $isOpen={isOpen}
      $isConnected={isConnected}
      $isOverlayOpen={isOverlayOpen}
    >
      <WidgetFrameWrapper>{children}</WidgetFrameWrapper>
    </StyledWidgetFrame>
  );
};

export default WidgetFrame;
