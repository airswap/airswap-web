import styled from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../../style/mixins";

export const Container = styled.div`
  display: flex;

  &:not(&:first-child) {
    margin-left: -0.25rem;
  }
`;

export const Arrow = styled.span`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0.1875rem 0.375rem 0.1875rem;
  border-color: transparent transparent ${({ theme }) => theme.colors.lightGrey}
    transparent;
`;

export const Button = styled.button<{
  isActive: boolean;
  isDescending: boolean;
  hasText: boolean;
}>`
  ${InputOrButtonBorderStyleType2};

  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  height: 1.5rem;
  padding: 0 0.25rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.white : theme.colors.lightGrey};

  &:not(&:focus) {
    border-color: transparent;
  }

  &:hover,
  &:focus,
  &:active {
    ${Arrow} {
      border-top-color: ${(props) => props.theme.colors.white};
    }
  }

  ${Arrow} {
    transform: ${({ isDescending }) =>
      isDescending ? "rotate(180deg) translateY(-1px)" : "translateY(1px)"};
    margin-left: ${({ hasText }) => (hasText ? "0.5rem" : "0")};
    border-bottom-color: ${({ theme, isActive }) =>
      isActive ? theme.colors.white : theme.colors.lightGrey};
  }
`;
