import styled from "styled-components/macro";

export const Container = styled.div`
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  padding: 1rem;
  display: grid;
  grid-auto-flow: column;
  cursor: pointer;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 1rem;
  align-items: center;

  &:not(:last-of-type) {
    border-bottom: 0;
  }

  & + & {
    border-top: 1px solid ${(props) => props.theme.colors.borderGrey};
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
`;

export const Image = styled.img`
  width: 2rem;
  height: 2rem;
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

export const ImportButton = styled.button`
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  justify-self: end;

  &:hover {
    background: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.black};
    transition: 0.25s ease-in-out;
  }
`;
