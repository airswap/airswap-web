import styled, { createGlobalStyle } from "styled-components/macro";

import convertHexToRGBA from "../../../../helpers/transformHexToRgba";

type BorderType = {
  position: "left" | "right";
};

const Border = styled.div<BorderType>`
  transition: opacity ease-out 0.3s;
  display: block;
  position: absolute;
  opacity: 0;
`;

export const BorderRight = styled(Border)`
  top: 0;
  right: ${(props) => (props.position === "right" ? 0 : "auto")};
  left: ${(props) => (props.position === "left" ? 0 : "auto")};
  width: 1px;
  height: 100%;
  background: ${(props) => props.theme.colors.primary};
`;

export const BorderHorizontal = styled(Border)`
  width: 50%;
  height: 1px;
  background: linear-gradient(
    ${(props) => (props.position === "left" ? "to left" : "to right")},
    ${(props) => convertHexToRGBA(props.theme.colors.primary, 0)} 0%,
    ${(props) => convertHexToRGBA(props.theme.colors.primary, 1)} 100%
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
        opacity: 1;
      }
    }
  }
`;
