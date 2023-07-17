import styled from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../style/mixins";
import IconButton from "../../../IconButton/IconButton";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: -0.25rem;
`;

export const Arrow = styled.span`
  width: 0;
  height: 0;
  border-left: 0.3125rem solid transparent;
  border-right: 0.3125rem solid transparent;

  border-top: 0.3125rem solid ${({ theme }) => theme.colors.lightGrey};
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
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.lightGrey};
  z-index: 1;

  &:not(&:focus) {
    border-color: transparent;
  }

  &:hover,
  &:focus,
  &:active {
    ${Arrow} {
      border-top-color: ${(props) => props.theme.colors.primary};
    }
  }

  ${Arrow} {
    transform: ${({ isDescending }) =>
      isDescending ? "rotate(180deg)" : "none"};
    margin-left: ${({ hasText }) => (hasText ? "0.25rem" : "0")};
    border-top-color: ${({ theme, isActive }) =>
      isActive ? theme.colors.primary : theme.colors.lightGrey};
  }
`;

export const TokenText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 110%;
  justify-content: flex-start;
  margin-top: -0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  padding: 0 0.3rem;

  & .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const StyledIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.lightGrey};
  padding: 0;
  border: none;
  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;
