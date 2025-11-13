import { NavLink } from "react-router-dom";

import styled, { DefaultTheme } from "styled-components/macro";

import {
  InputOrButtonBorderStyle,
  InputOrButtonBorderStyleType2,
} from "../../../../../style/mixins";
import { fontMono } from "../../../../../style/themes";
import { Tooltip } from "../../../../../styled-components/Tooltip/Tooltip";
import { OrderStatus } from "../../../../../types/orderStatus";
import Dropdown from "../../../../Dropdown/Dropdown";
import IconWarning from "../../../../Icon/icons/IconWarning";
import IconButton from "../../../../IconButton/IconButton";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
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
  $hasEnteredElement?: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: auto;
  opacity: ${({ orderStatus, $hasEnteredElement }) =>
    $hasEnteredElement ? 1 : orderStatus === OrderStatus.open ? 1 : 0.5};

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
  z-index: 2;
  cursor: pointer;
  transform: translateY(1px);
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

  &:last-child {
    align-items: flex-end;
  }
`;

export const ActionMenuButton = styled(IconButton)`
  ${InputOrButtonBorderStyle};

  position: absolute;
  top: -1px;
  right: 0rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  width: 2rem;
  height: 2rem;
  padding-bottom: 0.325rem;
  font-weight: 600;
  background: rgba(18, 32, 62, 1);

  &:focus,
  &:active {
    border: 1px solid ${({ theme }) => theme.colors.primary} !important;
  }
`;

export const ActionButtonLoader = styled(LoadingSpinner)`
  position: relative;
  z-index: 2;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
`;

export const ActionButtonContainer = styled.div`
  position: absolute;
  top: 0.9375rem;
  right: 0rem;
  z-index: 22;
`;

export const StyledNavLink = styled(NavLink)<{
  $isHovered?: boolean;
  $hasWarning?: boolean;
}>`
  position: absolute;
  top: -0.75rem;
  left: -0.75rem;
  border-radius: 0.5rem;
  width: calc(100% + 1.5rem);
  height: calc(100% + 1.5rem);
  background: #14213f;
  opacity: ${({ $isHovered }) => ($isHovered ? 1 : 0)};
  z-index: 1;
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

export const TokenIcon = styled(TokenLogo)<{ $invisible?: boolean }>`
  min-width: 2rem;
  max-width: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  background-color: ${({ theme }) => theme.colors.darkGrey};
  z-index: 3;
  pointer-events: none;
  opacity: ${({ $invisible }) => ($invisible ? 0 : 1)};
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
  top: -0.3125rem;
  left: -0.625rem;
  width: 1.5rem;
  height: 1.5rem;
  z-index: 5;
  cursor: pointer;
  filter: drop-shadow(1px 4px 4px rgba(0, 0, 0, 1));

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

export const ActionMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  position: absolute;
  top: 3.75rem;
  right: 0;
  width: 210px;
  height: 85px;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: 0.5rem;
  padding-inline: 1rem;
  background: rgba(18, 33, 61, 1);
  z-index: 20;
`;

export const NewActionMenuButton = styled.div`
  ${InputOrButtonBorderStyleType2};

  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid transparent !important;
  color: ${({ theme }) => theme.colors.white};

  &:hover,
  &:focus,
  &:active {
    text-decoration: underline;
  }
`;

export const NewActionMenuButtonIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
`;

export const StyledDropdown = styled(Dropdown)`
  position: absolute;
  top: 3.75rem;
  right: 0;
  width: 13.125rem;
  z-index: 10;
`;
