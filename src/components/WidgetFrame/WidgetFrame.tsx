import { WidgetFrameWrapper, StyledWidgetFrame } from "./WidgetFrame.styles";
import React, { FC, ReactElement } from "react";

type WidgetFrameType = {
  children?: React.ReactNode;
  isConnected?: boolean;
  isOpen?: boolean;
};

const WidgetFrame: FC<WidgetFrameType> = ({
  children,
  isOpen,
  isConnected,
}): ReactElement => {
  return (
    <StyledWidgetFrame $isOpen={isOpen} $isConnected={isConnected}>
      <WidgetFrameWrapper>{children}</WidgetFrameWrapper>
    </StyledWidgetFrame>
  );
};

export default WidgetFrame;
