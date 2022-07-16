import styled, { css } from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../style/mixins";
import Icon from "../../../Icon/Icon";

export const PillStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 1rem;
  height: 2rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
`;

export const Button = styled.button`
  ${PillStyle}
  ${InputOrButtonBorderStyleType2}

  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;

export const Quote = styled.span`
  ${PillStyle};
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;

export const NewQuoteText = styled.span`
  margin-right: 0.25rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.lightGrey : theme.colors.primary};
`;

export const StyledIcon = styled(Icon)`
  margin-right: 0.375rem;
`;
