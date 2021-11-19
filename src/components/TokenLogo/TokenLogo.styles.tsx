import { TokenInfo } from "@airswap/types";

import styled from "styled-components/macro";

export type sizes = "small" | "medium" | "large";

export type StyledTokenLogoProps = {
  size: sizes;
  tokenInfo: TokenInfo | null;
};

const remSizes: Record<sizes, string> = {
  small: "1.5rem",
  medium: "2rem",
  large: "2.5rem",
};

const StyledTokenLogo = styled.div<StyledTokenLogoProps>`
  width: ${(props) => remSizes[props.size]};
  height: ${(props) => remSizes[props.size]};
  background-image: ${(props) =>
    !props.tokenInfo
      ? "none"
      : !props.tokenInfo.logoURI
      ? "url(images/token-placeholder.svg)"
      : "url(" + props.tokenInfo.logoURI + ")"};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 50%;
  border-color: ${(props) => props.theme.colors.borderGrey};
  border-style: ${(props) => (!props.tokenInfo ? "solid" : "none")};
  /* Note this is only applied when not empty. */
  border-width: 1px;
`;

export default StyledTokenLogo;
