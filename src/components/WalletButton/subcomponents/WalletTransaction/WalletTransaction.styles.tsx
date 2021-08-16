import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 0.5rem auto 0.5rem;
  grid-gap: 1rem;
  align-items: center;
  font-size: 0.75rem;
  width: 100%;
  padding: 0.5rem;
  height: 4rem;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

export const SpanTitle = styled.span`
  font-weight: 600;
`;

export const SpanSubtitle = styled.span`
  color: ${(props) => props.theme.colors.lightGrey};
`;
