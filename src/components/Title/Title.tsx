import React, { FC, ReactElement } from 'react';
import { StyledComponent } from 'styled-components';
import { StyledH1, StyledH2, StyledH3, StyledH4 } from './Title.styles';

type TitleType = 'h1' | 'h2' | 'h3' | 'h4';

type SiteLogoProps = {
  className?: string;
  type: 'h1' | 'h2' | 'h3' | 'h4';
}

function getComponent(type: TitleType): StyledComponent<any, any> {
  switch (type) {
    case 'h1':
      return StyledH1
    case 'h2':
      return StyledH2
    case 'h3':
      return StyledH3
    default:
      return StyledH4
  }
}

const Title: FC<SiteLogoProps> = ({ className, children, type }): ReactElement => {

  const StyledTitle = getComponent(type);

  return (
    <StyledTitle className={className}>
      {children}
    </StyledTitle>
  );
};

export default Title;
