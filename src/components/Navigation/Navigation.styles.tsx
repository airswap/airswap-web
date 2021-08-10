import styled from "styled-components/macro";

import Icon from "../Icon/Icon";

export const NavigationButton = styled.a`
  display: flex;
  align-items: center;
  border-top: 1px solid ${(props) => props.theme.colors.grey};
  width: 100%;
  height: 4.5rem;
  padding-left: 2.625rem;
  font-size: ${(props) => props.theme.typography.nav.fontSize};
  font-weight: ${(props) => props.theme.typography.nav.fontWeight};
  line-height: ${(props) => props.theme.typography.nav.lineHeight};
  text-decoration: none;

  &:hover {
    opacity: 0.5;
  }

  &:last-of-type {
    border-bottom: 1px solid ${(props) => props.theme.colors.grey};
  }
`;

export const NavigationButtonIcon = styled(Icon)`
  margin-right: 1.5rem;
  color: ${(props) => props.theme.colors.grey};
`;

export const StyledNavigation = styled.nav`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;
