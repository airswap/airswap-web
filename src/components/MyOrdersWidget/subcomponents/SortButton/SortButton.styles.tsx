import styled from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../style/mixins";

export const Container = styled.div``;

export const Arrow = styled.span`
  width: 0;
  height: 0;
  border-left: 0.3125rem solid transparent;
  border-right: 0.3125rem solid transparent;

  border-top: 0.3125rem solid ${(props) => props.theme.colors.lightGrey};
`;

export const Button = styled.button<{
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
      isDescending ? "rotate(180deg)" : "none"};
    margin-left: ${({ hasText }) => (hasText ? "0.25rem" : "0")};
  }
`;
