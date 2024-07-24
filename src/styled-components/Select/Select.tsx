import styled, { css } from "styled-components/macro";

import {
  InputOrButtonBorderStyleType2,
  TextEllipsis,
} from "../../style/mixins";
import { fontWide } from "../../style/themes";

export const SelectElementStyle = css`
  ${InputOrButtonBorderStyleType2};

  font-family: ${fontWide};
  font-size: 1rem;
  font-weight: 500;
`;

export const SelectWrapper = styled.div`
  display: flex;
  height: 3.75rem;
  width: fit-content;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;

export const SelectLabel = styled.div`
  ${SelectElementStyle};
  ${TextEllipsis};

  display: flex;
  align-items: center;
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
  border-inline-end: unset;
  padding-inline: 1.25rem 0.25rem;
  color: ${({ theme }) => theme.colors.lightGrey};
  background: ${({ theme }) => theme.colors.darkGrey};

  &:hover,
  :active,
  :focus {
    border-color: ${({ theme }) => theme.colors.borderGrey};
    cursor: initial;
  }

  @supports (-moz-appearance: none) {
    line-height: 2.6875;
  }
`;
