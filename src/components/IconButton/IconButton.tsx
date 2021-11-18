import React, { ReactElement } from "react";

import { icons } from "../Icon/Icon";
import { StyledIcon, StyledIconButton } from "./IconButton.styles";

export type IconButtonProps = {
  text?: string;
  ariaLabel?: string;
  icon: keyof typeof icons;
  iconSize?: number;
  tabIndex?: number;
  onClick?: () => void;
  className?: string;
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { text, ariaLabel, icon, iconSize, tabIndex = 0, className, onClick },
    ref
  ): ReactElement => {
    return (
      <StyledIconButton
        hasText={!!text}
        aria-label={ariaLabel}
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
