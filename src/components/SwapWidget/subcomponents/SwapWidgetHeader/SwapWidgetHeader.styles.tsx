import styled, { css } from "styled-components/macro";

import { InputOrButtonBorderStyle } from "../../../../style/mixins";
import Icon from "../../../Icon/Icon";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 2rem;
  margin-bottom: 2rem;
  width: 100%;
`;

export const PillStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 1rem;
  height: 2rem;
  min-width: 9.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
`;

export const Button = styled.button`
  ${PillStyle}
  ${InputOrButtonBorderStyle}
`;

export const Quote = styled.span`
  ${PillStyle};
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
`;

export const NewQuoteText = styled.span`
  margin-right: 0.25rem;
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const StyledIcon = styled(Icon)`
  margin-right: 0.375rem;
`;
