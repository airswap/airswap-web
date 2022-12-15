import styled from "styled-components";
import { css } from "styled-components/macro";

import { StyledIcon } from "../../components/Icon/Icon.styles";
import { InputOrButtonBorderStyleType2 } from "../../style/mixins";

export const PillStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  padding: 0 1rem;
  height: 2rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.lightGrey : theme.colors.primary};

  @supports (-moz-appearance: none) {
    padding-top: 0.125rem;
  }
`;

export const LargePillButtonStyle = css`
  ${PillStyle};
  ${InputOrButtonBorderStyleType2};

  width: fit-content;
  height: 2.5rem;
  border-radius: 2.5rem;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.white};

    ${StyledIcon} {
      color: ${({ theme }) => theme.colors.white};
    }
  }

  ${StyledIcon} {
    margin-top: 2px;
    margin-left: 0.5rem;

    @supports (-moz-appearance: none) {
      margin-top: 0;
    }
  }
`;

export const Pill = styled.div`
  ${PillStyle};
`;

export const PillButton = styled.button`
  ${PillStyle};
  ${InputOrButtonBorderStyleType2};
`;

export const LargePillButton = styled.button`
  ${LargePillButtonStyle};
`;
