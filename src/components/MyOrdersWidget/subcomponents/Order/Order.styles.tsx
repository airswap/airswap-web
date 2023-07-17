import { NavLink } from "react-router-dom";

import styled, { DefaultTheme } from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../style/mixins";
import { fontMono } from "../../../../style/themes";
import { OrderStatus } from "../../../../types/orderStatus";
import IconButton from "../../../IconButton/IconButton";
import { MyOrdersGrid } from "../../MyOrdersWidget.styles";

export const Circle = styled.div`
  border-radius: 50%;
  width: 0.5rem;
  height: 0.5rem;
  background: ${({ theme }) => theme.colors.green};
`;

const getIndicatorColor = (
  theme: DefaultTheme,
  orderStatus: OrderStatus
): string => {
  if (orderStatus === OrderStatus.canceled) {
    return theme.colors.red;
  }

  if (orderStatus === OrderStatus.open) {
    return theme.colors.green;
  }

  return theme.colors.borderGrey;
};

export const Container = styled.div<{ orderStatus: OrderStatus }>`
  ${MyOrdersGrid};

  position: relative;
  border-top: 1px solid ${({ theme }) => theme.colors.borderGrey};
  align-items: center;
  height: 3rem;

  ${Circle} {
    background: ${({ theme, orderStatus }) =>
      getIndicatorColor(theme, orderStatus)};
  }
`;

export const StatusIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 1rem;
  cursor: pointer;
  z-index: 2;
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

export const ActionButtonContainer = styled.div`
  position: relative;
`;

export const ActionButton = styled(IconButton)`
  ${InputOrButtonBorderStyleType2};

  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  z-index: 2;

  &:hover,
  &:focus,
  &:active {
    color: ${({ theme }) =>
      theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  }
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
