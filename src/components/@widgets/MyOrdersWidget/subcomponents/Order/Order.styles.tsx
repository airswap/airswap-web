import { NavLink } from "react-router-dom";

import styled, { DefaultTheme } from "styled-components/macro";

import breakPoints from "../../../../../style/breakpoints";
import { fontMono } from "../../../../../style/themes";
import { Tooltip } from "../../../../../styled-components/Tooltip/Tooltip";
import { OrderStatus } from "../../../../../types/orderStatus";
import IconWarning from "../../../../Icon/icons/IconWarning";
import IconButton from "../../../../IconButton/IconButton";
import TokenLogo from "../../../../TokenLogo/TokenLogo";

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

export const Container = styled.div<{
  orderStatus: OrderStatus;
}>`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;

  position: relative;
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
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  position: relative;
  font-family: ${fontMono};
  font-size: 0.75rem;
  font-weight: 500;
  text-overflow: ellipsis;
  text-transform: uppercase;
  word-break: break-all;
  color: ${({ theme }) => theme.colors.carteBlanche};
  overflow: hidden;
  z-index: 2;
  pointer-events: none;

  @media ${breakPoints.tabletPortraitUp} {
    font-size: 1rem;
  }
`;

export const SignerAmount = styled(Text)``;
export const SenderAmount = styled(Text)``;
export const FilledAmount = styled(Text)``;
export const OrderStatusLabel = styled(Text)``;

export const ActionButtonContainer = styled.div`
  position: relative;
`;

export const ActionButton = styled(IconButton)`
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
    border: 1px solid ${({ theme }) => theme.colors.borderGrey};
    color: ${({ theme }) =>
      theme.name === "dark" ? theme.colors.white : theme.colors.primary};
    background: ${({ theme }) => theme.colors.darkGrey};
  }
`;

export const StyledNavLink = styled(NavLink)<{
  $isHovered?: boolean;
  $hasWarning?: boolean;
}>`
  position: absolute;
  top: -1px;
  left: ${({ $hasWarning }) => ($hasWarning ? "-2.25rem" : "-0.5rem")};
  border-radius: 0.5rem;
  width: ${({ $hasWarning }) =>
    $hasWarning ? "calc(100% + 3rem)" : "calc(100% + 1.25rem)"};
  height: calc(100% + 1px);
  background: ${({ theme }) => theme.colors.darkBlue};
  opacity: ${({ $isHovered }) => ($isHovered ? 1 : 0)};
  z-index: 1;

  &:hover,
  &:focus,
  &:active {
    opacity: 1;

    & + ${ActionButtonContainer} ${ActionButton} {
      background: ${({ theme }) => theme.colors.darkGrey};
    }
  }
`;

export const Tokens = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  gap: 0.25rem;
`;

export const TokenIcon = styled(TokenLogo)`
  min-width: 1.125rem;
  aspect-ratio: 1;
  background-color: ${({ theme }) => theme.colors.darkGrey};
  z-index: 3;
  pointer-events: none;
`;

export const StyledTooltip = styled(Tooltip)`
  display: none;
  position: absolute;
  top: 0.5rem;
  left: 0.625rem;
  height: 2rem;
  padding-block: 0.5rem;
  z-index: 5;
  pointer-events: none;
  color: ${({ theme }) => theme.colors.darkSubText};
`;

export const Warning = styled(IconWarning)`
  position: absolute;
  top: 0.75rem;
  left: -1.75rem;
  width: 1.5rem;
  height: 1.5rem;
  z-index: 3;
  cursor: pointer;

  &:hover {
    & + ${StyledTooltip} {
      display: block;
    }
  }
`;
