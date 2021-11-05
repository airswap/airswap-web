import React, { ReactElement } from "react";

import { icons } from "../Icon/Icon";
import { StyledIcon, StyledIconButton } from "./IconButton.styles";

export type IconButtonProps = {
  text?: string;
  icon: keyof typeof icons;
  iconSize?: number;
  tabIndex?: number;
  onClick?: () => void;
  className?: string;
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { text, icon, iconSize, tabIndex = 0, className, onClick },
    ref
  ): ReactElement => {
    return (
      <StyledIconButton
        hasText={!!text}
        tabIndex={tabIndex}
        className={className}
        onClick={onClick}
        ref={ref}
      >
        {text}
        <StyledIcon name={icon} iconSize={iconSize} />
      </StyledIconButton>
    );
  }
);

export default IconButton;
