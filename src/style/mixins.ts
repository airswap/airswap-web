import { css } from "styled-components";

export const ScrollBar = css`
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
