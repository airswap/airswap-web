import React, { FC, ReactElement } from 'react';
import { StyledNavigation, StyledNavigationAnchor, StyledNavigationIcon } from './Navigation.styles';
import { routes } from '../../routes';

const anchors = routes.filter(route => route.path !== '/');

const Navigation: FC = ({ children }): ReactElement => {

  return (
    <StyledNavigation>
      {anchors.map(route => (
        <StyledNavigationAnchor>
          <StyledNavigationIcon name="arrow-right" />
          {route.label}
        </StyledNavigationAnchor>
      ))}
    </StyledNavigation>
  )
};

export default Navigation;
