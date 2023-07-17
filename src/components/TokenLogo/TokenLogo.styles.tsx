import styled from "styled-components/macro";

export type sizes = "tiny" | "small" | "medium" | "large";

export type StyledTokenLogoProps = {
  size: sizes;
  logoURI?: string;
};

const remSizes: Record<sizes, string> = {
  tiny: "1.125rem",
  small: "1.5rem",
  medium: "2rem",
  large: "2.5rem",
};

const StyledTokenLogo = styled.div<StyledTokenLogoProps>`
  width: ${(props) => remSizes[props.size]};
  min-width: ${(props) => remSizes[props.size]};
  height: ${(props) => remSizes[props.size]};
  background-image: ${(props) =>
    !!props.logoURI ? `url("${props.logoURI}")` : "none"};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 50%;
  border-color: ${(props) => props.theme.colors.lightGrey};
  border-style: ${(props) => (props.logoURI ? "none" : "solid")};
  border-width: 1px;
`;

export default StyledTokenLogo;
