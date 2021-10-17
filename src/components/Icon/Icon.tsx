import { FC, ReactElement } from "react";
import { BiCheck } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import { IoMdInformationCircleOutline, IoMdSettings } from "react-icons/io";

import { StyledIcon } from "./Icon.styles";
import {
  IconAirswap,
  IconArrowLeft,
  IconArrowRight,
  IconBars,
  IconChevronDown,
  IconCampaign,
  IconCode,
  IconContactSupport,
  IconDarkModeSwitch,
  IconDeny,
  IconEdit,
  IconLibrary,
  IconLink,
  IconPending,
  IconVote,
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
  about: IconLibrary,
  airswap: IconAirswap,
  "arrow-right": IconArrowRight,
  "arrow-left": IconArrowLeft,
  bars: IconBars,
  "button-x": IconX,
  campaign: IconCampaign,
  "chevron-down": IconChevronDown,
  code: IconCode,
  "contact-support": IconContactSupport,
  "dark-mode-switch": IconDarkModeSwitch,
  deny: IconDeny,
  edit: IconEdit,
  "exit-modal": HiX,
  "information-circle-outline": IoMdInformationCircleOutline,
  "transaction-completed": BiCheck,
  "transaction-failed": HiX,
  "transaction-pending": IconPending,
  "transaction-link": IconLink,
  vote: IconVote,
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
