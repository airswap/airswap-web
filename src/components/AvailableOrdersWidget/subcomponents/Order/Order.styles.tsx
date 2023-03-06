import { NavLink } from "react-router-dom";

import styled from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../style/mixins";
import { fontMono } from "../../../../style/themes";
import { AvailableOrdersGrid } from "../../AvailableOrdersWidget.styles";

export const Container = styled.div`
  ${AvailableOrdersGrid};

  position: relative;
  border-top: 1px solid ${({ theme }) => theme.colors.borderGrey};
  align-items: center;
  height: 3rem;
`;

export const Text = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  position: relative;
  font-family: ${fontMono};
  font-size: 0.875rem;
  font-weight: 500;
  text-overflow: ellipsis;
  text-transform: uppercase;
  word-break: break-word;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
`;

export const StyledNavLink = styled(NavLink)`
  ${InputOrButtonBorderStyleType2};

  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  height: calc(100% + 1px);
  background: ${({ theme }) => theme.colors.borderGrey};
  opacity: 0;
  z-index: 1;

  &:hover,
  &:focus,
  &:active {
    opacity: 0.5;
  }
`;
