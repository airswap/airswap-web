import { TokenInfo } from "@airswap/typescript";

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
  min-width: ${(props) => remSizes[props.size]};
  height: ${(props) => remSizes[props.size]};
  background-image: ${(props) =>
    !!props.tokenInfo?.logoURI ? `url("${props.tokenInfo.logoURI}")` : "none"};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 50%;
  border-color: ${(props) => props.theme.colors.lightGrey};
  border-style: ${(props) => (props.tokenInfo?.logoURI ? "none" : "solid")};
  border-width: 1px;
`;

export default StyledTokenLogo;
