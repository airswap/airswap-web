import styled from "styled-components/macro";

import { Metadata } from "../../../Typography/Typography";

export const Container = styled.div`
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  padding: 1rem;
  display: grid;
  grid-auto-flow: column;
  cursor: pointer;
  grid-template-columns: auto minmax(auto, 1fr) 6.25rem;
  grid-gap: 1rem;
  align-items: center;

  &:not(:last-of-type) {
    border-bottom: 0;
  }

  & + & {
    border-top: 1px solid ${(props) => props.theme.colors.borderGrey};
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Symbol = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  line-height: 1rem;
`;

export const TokenName = styled.h3`
  font-size: 0.8rem;
  font-weight: 500;
  color: #9e9e9e;
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
