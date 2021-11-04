import styled from "styled-components/macro";

export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid ${(props) => props.theme.colors.darkGrey};
  border-radius: 24rem;
`;
