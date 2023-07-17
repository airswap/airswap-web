import styled from "styled-components/macro";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const Strong = styled.strong`
  margin: 0 0.25rem;
  color: ${(props) => props.theme.colors.white};
`;
