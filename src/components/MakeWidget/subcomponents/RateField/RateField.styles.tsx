import styled, { css } from "styled-components/macro";

import { fontMono } from "../../../../style/themes";
import Icon from "../../../Icon/Icon";
import IconButton from "../../../IconButton/IconButton";

export const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.lightGrey};
  margin-left: 0.175rem;
`;

export const StyledIconButton = styled(IconButton)`
  :focus {
    border-color: transparent;
  }

  :hover {
    border-color: ${({ theme }) => theme.colors.lightGrey};
  }

  :active {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Text = styled.div`
  margin-top: -2px;
`;

export const RateBox = styled.div`
  margin-top: -2px;
`;

export const Wrapper = styled.div<{ isButton: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.75rem;

  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};

  ${({ isButton, theme }) =>
    !isButton &&
    css`
      color: ${theme.colors.lightGrey};
      gap: 0.375rem;

      ${RateBox} {
        border-radius: 0.125rem;
        border: 1px solid ${theme.colors.borderGrey};
        font-family: ${fontMono};
        font-size: 0.875rem;
        font-weight: 500;
        padding: 0.25rem 0.5rem;
        margin-top: 0;
      }
    `}
`;
