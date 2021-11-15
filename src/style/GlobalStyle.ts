import "@fontsource/dm-mono/500.css";

import { createGlobalStyle } from "styled-components/macro";

import reset from "./reset";
import { fontLoos, fontMono } from "./themes";

const GlobalStyle = createGlobalStyle`
  ${reset}
  
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    font-family: ${fontLoos};
    color: ${(props) => props.theme.colors.alwaysWhite};
    background: ${(props) =>
      props.theme.name === "dark"
        ? props.theme.colors.black
        : props.theme.colors.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  p, h1, h2, h3, h4, h5, h6 {
    color: ${(props) =>
      props.theme.name === "dark"
        ? props.theme.colors.alwaysWhite
        : props.theme.colors.primary};
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
  
  input[inputmode="decimal"] {
    font-family: ${fontMono};
  }

  p {
    font-size: ${(props) => props.theme.typography.paragraph.fontSize};
    font-weight: ${(props) => props.theme.typography.paragraph.fontWeight};
    line-height: ${(props) => props.theme.typography.paragraph.lineHeight};
  }
`;

export default GlobalStyle;
