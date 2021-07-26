import styled from "styled-components/macro";

export type sizes = "small" | "medium" | "large";

export type StlyedTokenLogoProps = {
  size: sizes;
};

const remSizes: Record<sizes, string> = {
  small: "1.5rem",
  medium: "2rem",
  large: "3rem",
};

const StyledTokenLogo = styled.img<StlyedTokenLogoProps>`
  width: ${(props) => remSizes[props.size]};
  height: ${(props) => remSizes[props.size]};
`;

export default StyledTokenLogo;
