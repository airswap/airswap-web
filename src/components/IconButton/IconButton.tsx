import React, { FC, ReactElement } from "react";

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

const IconButton: FC<IconButtonProps> = ({
  text,
  icon,
  iconSize,
  tabIndex = 0,
  className,
  onClick,
}): ReactElement => {
  return (
    <StyledIconButton
      hasText={!!text}
      tabIndex={tabIndex}
      className={className}
      onClick={onClick}
    >
      {text}
      <StyledIcon name={icon} iconSize={iconSize} />
    </StyledIconButton>
  );
};

export default IconButton;
