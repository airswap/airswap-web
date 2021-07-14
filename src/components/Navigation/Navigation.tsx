import React, { FC, ReactElement } from 'react';
import { StyledNavigation } from './Navigation.styles';
import { routes } from '../../routes';
import Icon from '../Icon/Icon';

const anchors = routes.filter(route => route.path !== '/');

const Navigation: FC = ({ children }): ReactElement => {

  return (
    <StyledNavigation>
      {anchors.map(route => (
        <a href={route.path} className="navigation-button">
          <Icon className="navigation-button-icon" name="arrow-right" />
          {route.label}
        </a>
      ))}
    </StyledNavigation>
  )
};

export default Navigation;
