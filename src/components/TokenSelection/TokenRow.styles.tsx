import styled from "styled-components";

type ContainerProps = {
    disabled: boolean;
}

export const Container = styled.div<ContainerProps>`
  border: 1px solid #282828;
  margin: -1px -1px -1px -1px;
  padding: 1rem;
  display: grid;
  grid-auto-flow: column;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 1rem;
  align-items: center;
  opacity: ${props => props.disabled ? 0.6 : 1};
  &:hover {
    opacity: 0.6;
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
  color: #9E9E9E;
  line-height: 1rem;
`;

export const Span = styled.span``;

export const Balance = styled.div`
  justify-self: end;
`;