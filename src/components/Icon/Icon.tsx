import { FC, ReactElement } from "react";
import { BiCheck } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import { IoMdInformationCircleOutline, IoMdSettings } from "react-icons/io";

import { StyledIcon } from "./Icon.styles";
import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronDown,
  IconDarkModeSwitch,
  IconDeny,
  IconLink,
  IconPending,
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
  "chevron-down": IconChevronDown,
  "dark-mode-switch": IconDarkModeSwitch,
  deny: IconDeny,
  "information-circle-outline": IoMdInformationCircleOutline,
  "exit-modal": HiX,
  "transaction-completed": BiCheck,
  "transaction-failed": HiX,
  "transaction-pending": IconPending,
  "transaction-link": IconLink,
  "button-x": IconX,
  settings: IoMdSettings,
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
