import { NavLink } from "react-router-dom";

import styled from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../style/mixins";
import { fontMono } from "../../../../style/themes";
import IconButton from "../../../IconButton/IconButton";
import TokenLogo from "../../../TokenLogo/TokenLogo";
import { MyOrdersGrid } from "../../MyOrdersWidget.styles";

export const Circle = styled.div`
  border-radius: 50%;
  width: 0.5rem;
  height: 0.5rem;
  background: ${({ theme }) => theme.colors.green};
`;

export const Container = styled.div<{ isExpired: boolean }>`
  ${MyOrdersGrid};

  position: relative;
  border-top: 1px solid ${({ theme }) => theme.colors.borderGrey};
  align-items: center;
  height: 3rem;

  ${Circle} {
    background: ${({ theme, isExpired }) =>
      isExpired ? theme.colors.borderGrey : theme.colors.green};
  }
`;

export const ActiveIndicator = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
  pointer-events: none;
`;

export const StyledTokenLogo = styled(TokenLogo)`
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.black};
`;

export const TokenLogos = styled.div`
  display: flex;
  position: relative;
  z-index: 2;
  pointer-events: none;

  ${StyledTokenLogo} {
    &:nth-child(2) {
      margin-left: -0.5rem;
      z-index: 1;
    }
  }
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
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
`;

export const ActionButtonContainer = styled.div``;

export const ActionButton = styled(IconButton)`
  ${InputOrButtonBorderStyleType2};

  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  color: ${({ theme }) => theme.colors.lightGrey};
  z-index: 2;

  &:hover,
  &:focus,
  &:active {
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const StyledNavLink = styled(NavLink)`
  ${InputOrButtonBorderStyleType2};

  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  height: calc(100% + 2px);
  background: ${({ theme }) => theme.colors.borderGrey};
  opacity: 0;
  z-index: 1;

  &:hover,
  &:focus,
  &:active {
    opacity: 0.5;
  }
`;
