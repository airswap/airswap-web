import styled from "styled-components/macro";

import TokenLogo from "../../../TokenLogo/TokenLogo";
import { Metadata } from "../../../Typography/Typography";

export const Container = styled.div`
  display: flex;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  padding: 1rem;
  gap: 1rem;
  cursor: pointer;
  align-items: center;

  &:not(:last-of-type) {
    border-bottom: 0;
  }

  & + & {
    border-top: 1px solid ${(props) => props.theme.colors.borderGrey};
  }
`;

export const StyledTokenLogo = styled(TokenLogo)`
  min-width: 2rem;
  aspect-ratio: 1;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  max-width: calc(100% - 10rem);
  overflow: hidden;
`;

export const Symbol = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  line-height: 1rem;
`;

export const TokenName = styled.h3`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.darkSubText};
  line-height: 1rem;
`;

export const Span = styled.span``;

export const UnsupportedTokenText = styled(Metadata)`
  text-align: center;
  justify-self: center;
`;

export const ImportButton = styled.button`
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  justify-self: center;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};

  &:hover:not(:disabled) {
    background: ${({ theme }) =>
      theme.name === "dark" ? theme.colors.white : theme.colors.primary};
    color: ${(props) => props.theme.colors.black};
    transition: 0.25s ease-in-out;
  }
`;
