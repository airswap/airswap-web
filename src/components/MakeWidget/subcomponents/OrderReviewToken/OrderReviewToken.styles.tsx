import styled from "styled-components/macro";

import { fontMono } from "../../../../style/themes";
import TokenLogo from "../../../TokenLogo/TokenLogo";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 3.5rem;
`;

export const Label = styled.div`
  text-transform: uppercase;
  justify-self: flex-start;
  margin-right: auto;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) =>
    props.theme.name === "dark"
      ? props.theme.colors.lightGrey
      : props.theme.colors.primary};
`;

export const Amount = styled.div`
  margin-left: 1rem;
  font-size: 1.125rem;
  font-family: ${fontMono};
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.darkGrey};
`;

export const Symbol = styled.div`
  margin-left: 0.5rem;
  font-size: 1.125rem;
  font-family: ${fontMono};
  font-weight: 500;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.darkGrey};
`;

export const StyledTokenLogo = styled(TokenLogo)`
  margin-left: 1rem;
`;
