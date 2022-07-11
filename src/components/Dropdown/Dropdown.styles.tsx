import styled from "styled-components/macro";

import { InputOrButtonBorderStyle } from "../../style/mixins";

type StyledDropdownProps = {
  isSelected?: boolean;
  optionsShown?: boolean;
  itemWidth?: number;
};

export const Item = styled.button<StyledDropdownProps>`
  ${InputOrButtonBorderStyle}
  position: relative;
  border-right: none;
  border-left: none;
  border-top: none;
  font-weight: 700;
  text-transform: uppercase;
  text-align: left;

  &:hover,
  &:active,
  &:focus {
    border-color: ${({ theme }) => theme.colors.borderGrey};
  }

  ${({ isSelected }) =>
    isSelected &&
    ` display: none;
`}
`;

export const Current = styled.button<StyledDropdownProps>`
  ${InputOrButtonBorderStyle}
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-radius: 0rem 1rem 1rem 0rem;
  width: ${({ itemWidth }) => itemWidth || 10}rem;
  padding: 0.5rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderGrey};
    background-color: ${({ theme }) => theme.colors.borderGrey};
  }

  &:active,
  &:focus {
    border-color: ${({ theme }) => theme.colors.borderGrey};
  }

  & > ${Item} {
    border: none;
  }

  ${({ optionsShown }) =>
    optionsShown &&
    ` border-radius: 0rem 1rem 0rem 0rem;
`}
`;

export const Wrapper = styled.div``;

export const AbsoluteWrapper = styled.button<StyledDropdownProps>`
  ${InputOrButtonBorderStyle}

  display: flex;
  flex-direction: column;
  position: absolute;
  border-radius: 0 0 1rem 1rem;
  border-top: none;
  width: ${({ itemWidth }) => itemWidth || 10}rem;
  overflow: hidden;
  cursor: pointer;

  &:hover,
  &:active,
  &:focus {
    border-color: ${({ theme }) => theme.colors.borderGrey};
  }

  & ${Item} {
    width: ${({ itemWidth }) => itemWidth || 10}rem;
    padding: 0.5rem;

    &:hover,
    &:active,
    &:focus {
      background-color: ${({ theme }) => theme.colors.borderGrey};
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;
