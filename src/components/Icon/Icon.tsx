import React, { FC, ReactElement } from "react";
import { BiCheck } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdKeyboardArrowDown, MdAccessTime, MdOpenInNew } from "react-icons/md";

import { StyledIcon } from "./Icon.styles";
import {
  IconArrowLeft,
  IconArrowRight,
  IconDarkModeSwitch,
  IconDeny,
  IconX,
} from "./icons";

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
  deny: IconDeny,
  "information-circle-outline": IoMdInformationCircleOutline,
  "exit-modal": HiX,
  "transaction-completed": BiCheck,
  "transaction-failed": HiX,
  "transaction-pending": MdAccessTime,
  "transaction-link": MdOpenInNew,
  "button-x": IconX,
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
