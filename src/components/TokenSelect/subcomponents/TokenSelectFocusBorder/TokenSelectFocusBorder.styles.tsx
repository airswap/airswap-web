import styled, { createGlobalStyle } from "styled-components/macro";

import convertHexToRGBA from "../../../../helpers/transformHexToRgba";

type BorderType = {
  position: "left" | "right";
};

const Border = styled.div<BorderType>`
  transition: opacity ease-out 0.3s;
  display: block;
  position: absolute;
  background: ${(props) => props.theme.colors.primary};
  background: linear-gradient(
    90deg,
    ${(props) => convertHexToRGBA(props.theme.colors.primary, 0)} 0%,
    ${(props) => convertHexToRGBA(props.theme.colors.primary, 1)} 100%
  );
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

export const BorderTop = styled(Border)`
  transform: ${(props) =>
    props.position === "left" ? "scaleX(-100%)" : "none"};
  top: 0;
  right: ${(props) => (props.position === "right" ? 0 : "auto")};
  left: ${(props) => (props.position === "left" ? 0 : "auto")};
  width: 50%;
  height: 1px;
`;

export const BorderBottom = styled(Border)`
  transform: ${(props) =>
    props.position === "left" ? "scaleX(-100%)" : "none"};
  bottom: 0;
  right: ${(props) => (props.position === "right" ? 0 : "auto")};
  left: ${(props) => (props.position === "left" ? 0 : "auto")};
  width: 50%;
  height: 1px;
  background: linear-gradient(
    90deg,
    ${(props) => convertHexToRGBA(props.theme.colors.primary, 0)} 0%,
    ${(props) => convertHexToRGBA(props.theme.colors.primary, 1)} 100%
  );
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
