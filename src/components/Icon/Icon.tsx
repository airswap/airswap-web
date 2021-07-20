import React, { FC, ReactElement } from 'react';
import { IconArrowLeft, IconArrowRight, IconDarkModeSwitch } from './icons';
import { StyledIcon } from './Icon.styles';

type IconSet = {
  [key: string]: FC<SvgIconProps>;
}

export interface SvgIconProps {
  className?: string;
  iconSize?: number;
  color?: string;
}

export const icons: IconSet = {
  'arrow-right': IconArrowRight,
  'arrow-left': IconArrowLeft,
  'dark-mode-switch': IconDarkModeSwitch,
}

interface IconProps extends SvgIconProps {
  name: keyof typeof icons;
}

const Icon: FC<IconProps> = ({ name, iconSize = 1, className = '' }): ReactElement | null => {
  const IconComponent = icons[name];

  return IconComponent ? (
    <StyledIcon iconSize={iconSize} className={className}>
      <IconComponent />
    </StyledIcon>
  ) : null;
};


export default Icon;
