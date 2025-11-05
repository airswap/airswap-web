import { NavLink } from "react-router-dom";

import styled, { DefaultTheme } from "styled-components/macro";

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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-block: 0.5rem;
  height: auto;
  opacity: ${({ orderStatus }) => (orderStatus === OrderStatus.open ? 1 : 0.5)};

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
  // font-family: ${fontMono};
  font-size: 0.9375rem;
  font-weight: 500;
  text-overflow: ellipsis;
  word-break: break-all;
  color: ${({ theme }) => theme.colors.darkSubText};
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
`;

export const SignerAmount = styled(Text)`
  margin-top: -0.25rem;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.carteBlanche};
`;
export const SenderAmount = styled(SignerAmount)``;
export const FilledAmount = styled(Text)`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.white};
`;
export const MetaLabel = styled(Text)`
  font-size: 0.75rem;
  text-transform: uppercase;
`;
export const OrderStatusLabel = styled(Text)`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.white};
`;
export const OrderStatusAndIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const MetaItems = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1;
`;

export const MetaItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &:last-child {
    align-items: flex-end;
  }
`;

export const ActionButtonContainer = styled.div`
  position: absolute;
  top: 0.9375rem;
  right: 0rem;
  z-index: 22;
`;

export const ActionButton = styled(IconButton)`
  position: relative;
  z-index: 2;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  background: ${({ theme }) => theme.colors.darkGrey};

  &:hover,
  &:focus,
  &:active {
    border: 1px solid ${({ theme }) => theme.colors.borderGrey};
    color: ${({ theme }) =>
      theme.name === "dark" ? theme.colors.white : theme.colors.primary};
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
    opacity: 0.2;
  }
`;

export const TokensAndAmountContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TokenAndAmount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:nth-child(2) {
    flex-direction: row-reverse;

    ${Text} {
      text-align: right;
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
  min-width: 2rem;
  max-width: 2rem;
  min-height: 2rem;
  max-height: 2rem;
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

export const Divider = styled.div`
  width: 100%;
  min-height: 1px;
  background: rgba(53, 69, 98, 0.5);
`;
