import React, { FC, ReactElement } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";

import { StyledIcon } from "./Icon.styles";
import { IconArrowLeft, IconArrowRight, IconDarkModeSwitch } from "./icons";

type IconSet = {
  [key: string]: FC<SvgIconProps>;
};

export interface SvgIconProps {
  className?: string;
  iconSize?: number;
  color?: string;
}

export const icons: IconSet = {
  "arrow-right": IconArrowRight,
  "arrow-left": IconArrowLeft,
  "chevron-down": MdKeyboardArrowDown,
  "dark-mode-switch": IconDarkModeSwitch,
  "information-circle-outline": IoMdInformationCircleOutline,
};

interface IconProps extends SvgIconProps {
  name: keyof typeof icons;
}

const Icon: FC<IconProps> = ({
  name,
  iconSize = 1,
  className = "",
}): ReactElement | null => {
  const IconComponent = icons[name];

  return IconComponent ? (
    <StyledIcon iconSize={iconSize} className={className}>
      <IconComponent />
    </StyledIcon>
  ) : null;
};

export default Icon;
