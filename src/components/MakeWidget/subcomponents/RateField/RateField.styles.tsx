import styled, { css } from "styled-components/macro";

import { BorderedPill } from "../../../../style/mixins";
import { fontMono } from "../../../../style/themes";
import Icon from "../../../Icon/Icon";
import IconButton from "../../../IconButton/IconButton";

const ButtonBorder = css`
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

export const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.lightGrey};
  padding-left: 0.5rem;
`;

export const StyledIconButton = styled(IconButton)`
  ${ButtonBorder};
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
  width: fit-content;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.75rem;

  ${({ isButton }) =>
    isButton &&
    css`
      ${BorderedPill};
      ${ButtonBorder};

      color: ${({ theme }) =>
        theme.name === "dark" ? theme.colors.white : theme.colors.primary};
      gap: 0.125rem;

      /* fixes pixel differences with bordered pill */

      height: 2.5rem;
      padding: 0 1rem;

      cursor: pointer;
    `}

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
