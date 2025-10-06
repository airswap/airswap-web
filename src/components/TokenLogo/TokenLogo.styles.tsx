import styled from "styled-components/macro";

export type StyledTokenLogoProps = {
  logoURI?: string;
};

const StyledTokenLogo = styled.div<StyledTokenLogoProps>`
  background-image: ${(props) =>
    props.logoURI ? `url("${props.logoURI}")` : "none"};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 50%;
  border-color: ${(props) => props.theme.colors.lightGrey};
  border-style: ${(props) => (props.logoURI ? "none" : "solid")};
  border-width: ${(props) => (props.logoURI ? 0 : 1)}px;
`;

export default StyledTokenLogo;
