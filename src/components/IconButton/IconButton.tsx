import React, { FC, ReactElement } from 'react';
import Icon, { icons } from '../Icon/Icon';
import { StyledIconButton } from './IconButton.styles';

export type IconButtonProps = {
  text?: string;
  icon: keyof typeof icons;
  onClick: () => void;
  className?: string;
}

const IconButton: FC<IconButtonProps> = ({
  text,
  icon,
  className,
  onClick,
}): ReactElement => {
  return (
    <StyledIconButton
      className={className}
      onClick={onClick}
    >
      {text}
      <Icon name={icon} />
    </StyledIconButton>
  );
};

export default IconButton;
