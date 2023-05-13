import styled from "styled-components/macro";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${(props) => props.theme.colors.white};
`;

export const Strong = styled.strong`
  margin: 0 0.25rem;
  color: ${(props) => props.theme.colors.white};
`;
