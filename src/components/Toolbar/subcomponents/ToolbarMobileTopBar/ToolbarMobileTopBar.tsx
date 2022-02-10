import React, { FC, RefObject } from "react";

import {
  Container,
  StyledAirswapButton,
  StyledCloseButton,
} from "./ToolbarMobileTopBar.styles";

export type ToolbarMobileTopBarType = {
  toolbarRef: RefObject<HTMLDivElement>;
  onAirswapButtonClick?: () => void;
  onCloseButtonClick?: () => void;
};

const ToolbarMobileTopBar: FC<ToolbarMobileTopBarType> = ({
  toolbarRef,
  onAirswapButtonClick,
  onCloseButtonClick,
}) => {
  return (
    <Container ref={toolbarRef}>
      <StyledAirswapButton
        onClick={onAirswapButtonClick}
        icon="airswap"
        iconSize={2}
      />
      <StyledCloseButton
        onClick={onCloseButtonClick}
        icon="close"
        iconSize={0.875}
      />
    </Container>
  );
};

export default ToolbarMobileTopBar;
