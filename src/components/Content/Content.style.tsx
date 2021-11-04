import styled from "styled-components/macro";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem 0;
`;

export const Link = styled.a`
  text-decoration: underline;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
`;
