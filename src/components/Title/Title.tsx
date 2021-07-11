import React, { FC, ReactElement } from 'react';
import { StyledH1, StyledH2, StyledH3, StyledH4 } from './Title.styles';

type TitleType = 'h1' | 'h2' | 'h3' | 'h4';

type TitleProps = {
  className?: string;
  type: TitleType;
}

const titles: Record<TitleType, FC<{ className?: string }>> = {
  'h1': StyledH1,
  'h2': StyledH2,
  'h3': StyledH3,
  'h4': StyledH4,
}

export interface SvgIconProps {
  className?: string;
}

const Title: FC<TitleProps> = ({ className, children, type }): ReactElement => {

  const StyledTitle = titles[type];

  return (
    <StyledTitle className={className}>
      {children}
    </StyledTitle>
  );
};

export default Title;
