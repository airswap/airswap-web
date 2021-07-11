import React, { FC, ReactElement } from 'react';
import { IconArrowLeft, IconArrowRight } from './icons';
import { StyledIcon } from './Icon.styles';

type IconSet = {
  [key: string]: FC<SvgIconProps>;
}

export interface SvgIconProps {
  className?: string;
  color?: string;
}

export const icons: IconSet = {
  'arrow-right': IconArrowRight,
  'arrow-left': IconArrowLeft,
}

interface IconProps extends SvgIconProps {
  name: keyof typeof icons;
}

const Icon: FC<IconProps> = ({ name, className = '' }): ReactElement | null => {
  const IconComponent = icons[name];

  return IconComponent ? <StyledIcon><IconComponent className={className} /></StyledIcon> : null;
};


export default Icon;
