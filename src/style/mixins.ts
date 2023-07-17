import { css } from "styled-components/macro";

import convertHexToRGBA from "../helpers/transformHexToRgba";
import breakPoints from "./breakpoints";

export const ScrollBarStyle = css`
  &::-webkit-scrollbar {
    border-radius: 0.5rem;
    width: 0.5rem;
    background: ${({ theme }) =>
      theme.name === "dark" ? theme.colors.darkGrey : theme.colors.borderGrey};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) =>
      theme.name === "dark" ? theme.colors.white : theme.colors.primary};
    border-radius: 0.5rem;
  }
`;

export const InputOrButtonBorderStyle = css`
  border: 1px solid
    ${({ theme }) =>
      theme.name === "dark"
        ? theme.colors.borderGrey
        : convertHexToRGBA(theme.colors.borderGrey, 0.2)};

  &:hover,
  &:focus {
    outline: 0;
    border-color: ${(props) => props.theme.colors.lightGrey};
  }

  &:active {
    border-color: ${(props) =>
      props.theme.name === "dark"
        ? props.theme.colors.primary
        : props.theme.colors.alwaysWhite};
  }
`;

export const InputOrButtonBorderStyleType2 = css`
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};

  &:hover,
  &:focus {
    outline: 0;
    border-color: ${(props) => props.theme.colors.lightGrey};
  }

  &:active {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const InputTextStyle = css`
  ${InputOrButtonBorderStyleType2};

  line-height: 2.25;
  padding: 0.25rem 0.625rem;
  font-size: 1rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.white};

  &::placeholder {
    color: ${(props) => props.theme.colors.lightGrey};
  }

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const BorderlessButtonStyle = css`
  border: 1px solid transparent;

  &:focus {
    outline: 0;
    border-color: ${(props) => props.theme.colors.lightGrey};
  }

  &:active {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const BorderlessButtonStyleType2 = css`
  ${BorderlessButtonStyle}

  &:active {
    border-color: ${(props) =>
      props.theme.name === "dark"
        ? props.theme.colors.primary
        : props.theme.colors.alwaysWhite};
  }
`;

export const BorderedPill = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 24rem;
  height: 3rem;
  padding: 0 1.25rem;

  @media ${breakPoints.phoneOnly} {
    height: 2.5rem;
  }
`;

export const TextEllipsis = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FlexAlignCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;
