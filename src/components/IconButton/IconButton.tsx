import React, { FC, ReactElement } from "react";

import { icons } from "../Icon/Icon";
import { StyledIcon, StyledIconButton } from "./IconButton.styles";

export type IconButtonProps = {
  text?: string;
  icon: keyof typeof icons;
  iconSize?: number;
  onClick?: () => void;
  className?: string;
};

const IconButton: FC<IconButtonProps> = ({
  text,
  icon,
  iconSize,
  className,
  onClick,
}): ReactElement => {
  return (
    <StyledIconButton hasText={!!text} className={className} onClick={onClick}>
      {text}
      <StyledIcon name={icon} iconSize={iconSize} />
    </StyledIconButton>
  );
};

export default IconButton;
