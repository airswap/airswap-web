import React, { FC, ReactElement } from 'react';
import { StyledDarkModeSwitch, StyledNavigation, StyledNavigationAnchor } from './Navigation.styles';
import { routes } from '../../routes';

const anchors = routes.filter(route => route.path !== '/');

const Navigation: FC = ({ children }): ReactElement => {

  return (
    <StyledNavigation>
      {anchors.map(route => (
        <StyledNavigationAnchor href={route.path}>
          {route.label}
        </StyledNavigationAnchor>
      ))}
      <StyledDarkModeSwitch />
    </StyledNavigation>
  )
};

export default Navigation;
