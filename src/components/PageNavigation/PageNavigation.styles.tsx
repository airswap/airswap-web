import { NavLink } from "react-router-dom";

import styled from "styled-components/macro";

import { sizes } from "../../style/sizes";

export const Container = styled.div<{ className?: string }>`
  display: flex;
  order: -1;
  gap: 0.25rem;
  margin-block-end: ${sizes.widgetGutter};
  margin-inline: auto;
  width: fit-content;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  padding: 0.375rem;
`;

export const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5625rem;
  height: 2.25rem;
  padding-inline: 2rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.9375rem;
  font-weight: 500;
  text-transform: uppercase;

  &:hover,
  &:focus,
  &.active {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.darkBlue};
  }
`;
