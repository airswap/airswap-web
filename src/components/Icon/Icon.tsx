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
  IconChevronUpDown,
  IconBars,
  IconBin,
  IconCampaign,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconClose,
  IconCode,
  IconCopy,
  IconCopy2,
  IconContactSupport,
  IconDarkModeSwitch,
  IconDeny,
  IconDiscord,
  IconEdit,
  IconForbidden,
  IconGithub,
  IconLibrary,
  IconLink,
  IconMedium,
  IconMenu,
  IconPending,
  IconPlus,
  IconStar,
  IconSwap,
  IconSwapHorizontal,
  IconTelegram,
  IconTransaction,
  IconTwitter,
  IconVote,
  IconX,
  IconCloseCircleOutline,
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
  learn: IconLibrary,
  airswap: IconAirswap,
  "arrow-down": IconArrowDown,
  "arrow-right": IconArrowRight,
  "arrow-left": IconArrowLeft,
  bars: IconBars,
  bin: IconBin,
  "button-x": IconX,
  campaign: IconCampaign,
  check: IconCheck,
  "chevron-down": IconChevronDown,
  "chevron-right": IconChevronRight,
  "chevron-up-down": IconChevronUpDown,
  close: IconClose,
  "close-circle-outline": IconCloseCircleOutline,
  code: IconCode,
  copy: IconCopy,
  copy2: IconCopy2,
  "contact-support": IconContactSupport,
  "dark-mode-switch": IconDarkModeSwitch,
  deny: IconDeny,
  discord: IconDiscord,
  edit: IconEdit,
  "exit-modal": HiX,
  forbidden: IconForbidden,
  github: IconGithub,
  "information-circle-outline": IoMdInformationCircleOutline,
  menu: IconMenu,
  medium: IconMedium,
  plus: IconPlus,
  settings: IoMdSettings,
  star: IconStar,
  swap: IconSwap,
  "swap-horizontal": IconSwapHorizontal,
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
