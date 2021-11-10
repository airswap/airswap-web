import { css } from "styled-components/macro";

export const ScrollBarStyle = css`
  &::-webkit-scrollbar {
    border-radius: 0.5rem;
    width: 0.5rem;
    background: ${(props) => props.theme.colors.darkGrey};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.white};
    border-radius: 0.5rem;
  }
`;

export const InputOrButtonBorderStyle = css`
  border: 1px solid ${(props) => props.theme.colors.borderGrey};

  &:hover,
  &:focus {
    outline: 0;
    border-color: ${(props) => props.theme.colors.lightGrey};
  }

  &:active {
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

export const BorderedPill = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 24rem;
  height: 3rem;
  padding: 0 1.25rem;
`;
