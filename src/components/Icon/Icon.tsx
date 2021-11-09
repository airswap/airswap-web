import { FC, ReactElement } from "react";
import { BiCheck } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import { IoMdInformationCircleOutline, IoMdSettings } from "react-icons/io";

import { StyledIcon } from "./Icon.styles";
import {
  IconAirswap,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconBars,
  IconChevronDown,
  IconChevronRight,
  IconCampaign,
  IconCode,
  IconContactSupport,
  IconDarkModeSwitch,
  IconDeny,
  IconEdit,
  IconForbidden,
  IconLibrary,
  IconLink,
  IconPending,
  IconStar,
  IconSwap,
  IconTelegram,
  IconTransaction,
  IconTwitter,
  IconVote,
  IconX,
  IconDiscord,
  IconMedium,
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
  "arrow-down": IconArrowDown,
  "arrow-right": IconArrowRight,
  "arrow-left": IconArrowLeft,
  bars: IconBars,
  "button-x": IconX,
  campaign: IconCampaign,
  "chevron-down": IconChevronDown,
  "chevron-right": IconChevronRight,
  code: IconCode,
  "contact-support": IconContactSupport,
  "dark-mode-switch": IconDarkModeSwitch,
  deny: IconDeny,
  discord: IconDiscord,
  edit: IconEdit,
  "exit-modal": HiX,
  forbidden: IconForbidden,
  "information-circle-outline": IoMdInformationCircleOutline,
  medium: IconMedium,
  settings: IoMdSettings,
  star: IconStar,
  swap: IconSwap,
  telegram: IconTelegram,
  "transaction-completed": BiCheck,
  "transaction-failed": HiX,
  "transaction-pending": IconPending,
  "transaction-link": IconLink,
  transaction: IconTransaction,
  twitter: IconTwitter,
  "wallet-link": IconLink,
  vote: IconVote,
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
