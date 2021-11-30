import styled from "styled-components";

const Link = styled.a`
  text-decoration: underline;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;

  &:active {
    color: ${(props) => props.theme.colors.primaryDark};
  }

  &:visited {
    color: ${(props) => props.theme.colors.white};
  }
`;

export default Link;
