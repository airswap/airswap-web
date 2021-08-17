import styled from "styled-components";

export const Link = styled.a`
  color: ${(props) => props.theme.colors.lightGrey};
  &:hover {
    opacity: 0.7;
  }
`;
