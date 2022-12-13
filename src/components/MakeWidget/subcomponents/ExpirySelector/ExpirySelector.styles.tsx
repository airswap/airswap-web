import styled, { css } from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../style/mixins";
import Dropdown from "../../../Dropdown/Dropdown";
import { SelectButtonText } from "../../../Dropdown/Dropdown.styles";

export const SelectorStyle = css`
  ${InputOrButtonBorderStyleType2};

  font-size: 0.75rem;
  font-weight: 700;
  margin-right: -1px;

  @supports (-moz-appearance: none) {
    padding-top: 0.125rem;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  height: 2rem;
  width: fit-content;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;

export const Title = styled.button`
  ${SelectorStyle};

  color: ${({ theme }) => theme.colors.lightGrey};
  text-transform: uppercase;
  padding: 0 0.75rem;
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;

  &:hover,
  :active,
  :focus {
    border: 1px solid ${({ theme }) => theme.colors.borderGrey};
    cursor: initial;
  }
`;

export const Input = styled.input`
  all: unset;

  ${SelectorStyle};

  width: 2.5rem;
  text-align: center;

  &:hover,
  :active,
  :focus {
    z-index: 1;
  }
`;

export const StyledDropdown = styled(Dropdown)`
  ${SelectButtonText} {
    max-width: 7rem;
  }
`;
