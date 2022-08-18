import styled from "styled-components";
import { css } from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../style/mixins";

export const PillStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  padding: 0 1rem;
  height: 2rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.lightGrey : theme.colors.primary};
`;

export const Pill = styled.div`
  ${PillStyle};
`;

export const PillButton = styled.button`
  ${PillStyle};
  ${InputOrButtonBorderStyleType2};
`;
