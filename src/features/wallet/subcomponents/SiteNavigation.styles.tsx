import { Link, NavLink } from "react-router-dom";

import styled, { css } from "styled-components/macro";

import { BorderlessButtonStyle } from "../../../style/mixins";

export const Container = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const ButtonStyle = css`
  ${BorderlessButtonStyle};

  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
  padding-inline: 0.25rem;
  color: ${({ theme }) => theme.colors.carteBlanche};

  &:hover,
  &:focus,
  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const NavigationLink = styled.a`
  ${ButtonStyle};
`;

export const NavigationNavLink = styled(NavLink)`
  ${ButtonStyle};

  &.active {
    color: ${({ theme }) => theme.colors.white};
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
