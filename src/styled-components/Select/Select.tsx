import styled, { css } from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../style/mixins";

export const SelectElementStyle = css`
  ${InputOrButtonBorderStyleType2};

  font-size: 0.75rem;
  font-weight: 700;
  margin-right: -1px;
`;

export const SelectWrapper = styled.div`
  display: flex;
  height: 2rem;
  width: fit-content;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;

export const SelectLabel = styled.div`
  ${SelectElementStyle};

  display: flex;
  align-items: center;
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
  padding: 0 0.75rem;
  color: ${({ theme }) => theme.colors.lightGrey};
  text-transform: uppercase;

  &:hover,
  :active,
  :focus {
    border: 1px solid ${({ theme }) => theme.colors.borderGrey};
    cursor: initial;
  }
`;
