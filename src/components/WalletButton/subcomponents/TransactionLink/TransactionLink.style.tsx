import styled from "styled-components";

export const Link = styled.a`
  transform: translate(0.5rem, -0.5rem);
  padding: 0.5rem;
  color: ${(props) => props.theme.colors.lightGrey};

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }
`;
