import { NavLink } from "react-router-dom";

import styled from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../style/mixins";
import { fontMono } from "../../../../style/themes";
import { Tooltip } from "../../../../styled-components/Tooltip/Tooltip";
import { AvailableOrdersGrid } from "../../AvailableOrdersWidget.styles";

export const Container = styled.div`
  ${AvailableOrdersGrid};

  position: relative;
  border-top: 1px solid ${({ theme }) => theme.colors.borderGrey};
  align-items: center;
  height: 3rem;
`;

export const Text = styled.div`
  position: relative;
  width: 75%;
  font-family: ${fontMono};
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
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

export const StyledTooltip = styled(Tooltip)<{ position: number }>`
  justify-content: flex-start;
  position: absolute;
  top: 2rem;
  left: ${({ position }) => `calc(33% * ${position})`};
  width: auto;
  z-index: 3;
  pointer-events: none;
`;
