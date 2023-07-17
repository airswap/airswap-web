import styled from "styled-components/macro";

import { TextEllipsis } from "../../../../style/mixins";
import { fontMono } from "../../../../style/themes";
import TokenLogo from "../../../TokenLogo/TokenLogo";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  height: 3.5rem;
`;

export const Label = styled.div`
  ${TextEllipsis};

  text-transform: uppercase;
  justify-self: flex-start;
  width: 5rem;
  margin-right: auto;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) =>
    props.theme.name === "dark"
      ? props.theme.colors.lightGrey
      : props.theme.colors.primary};
`;

export const Amount = styled.div`
  ${TextEllipsis};

  margin-left: 1rem;
  min-width: 4rem;
  text-align: right;
  font-size: 1.125rem;
  font-family: ${fontMono};
  font-weight: 500;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.darkGrey};
`;

export const Symbol = styled.div`
  ${TextEllipsis};

  margin-left: 0.5rem;
  font-size: 1.125rem;
  font-family: ${fontMono};
  font-weight: 500;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.darkGrey};
  min-width: 3rem;
  max-width: 4rem;
  text-align: right;
`;

export const StyledTokenLogo = styled(TokenLogo)`
  margin-left: 1rem;
`;
