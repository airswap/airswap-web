import styled, { createGlobalStyle } from "styled-components/macro";

import convertHexToRGBA from "../../../../helpers/transformHexToRgba";

type BorderType = {
  position: "left" | "right";
  hasError: boolean;
};

const Border = styled.div<BorderType>`
  transition: opacity ease-out 0.3s;
  display: block;
  position: absolute;
  opacity: ${({ hasError }) => (hasError ? 1 : 0)};
`;

export const Background = styled.div<{ position: "left" | "right" }>`
  position: absolute;
  // top: 0;
  // left: 0;
  // border: 1px solid ${(props) => props.theme.colors.lightGrey};
  // border-radius: 0.125rem;
  // width: 100%;
  // height: 100%;
  // background: linear-gradient(90deg, #111D34 0%, #142445 100%);
`;

export const BorderRight = styled(Border)`
  top: 0;
  right: ${(props) => (props.position === "right" ? 0 : "auto")};
  left: ${(props) => (props.position === "left" ? 0 : "auto")};
  width: 1px;
  height: 100%;
  background: ${({ theme, hasError }) =>
    hasError ? theme.colors.red : theme.colors.primary};
`;

export const BorderHorizontal = styled(Border)`
  width: 50%;
  height: 1px;
  background: linear-gradient(
    ${(props) => (props.position === "left" ? "to left" : "to right")},
    ${({ theme, hasError }) =>
        convertHexToRGBA(hasError ? theme.colors.red : theme.colors.primary, 0)}
      0%,
    ${({ theme, hasError }) =>
        convertHexToRGBA(hasError ? theme.colors.red : theme.colors.primary, 1)}
      100%
  );
`;

export const BorderTop = styled(BorderHorizontal)`
  top: 0;
  right: ${(props) => (props.position === "right" ? 0 : "auto")};
  left: ${(props) => (props.position === "left" ? 0 : "auto")};
`;

export const BorderBottom = styled(BorderHorizontal)`
  bottom: 0;
  right: ${(props) => (props.position === "right" ? 0 : "auto")};
  left: ${(props) => (props.position === "left" ? 0 : "auto")};
`;

export const GlobalStyle = createGlobalStyle`
  input, button {
    &:focus, &:hover {
      & ~ ${Border} {
        // opacity: 1;
      }
    }
  }
`;
