import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";

import { createGlobalStyle } from "styled-components/macro";

import reset from "./reset";

const GlobalStyle = createGlobalStyle`
  ${reset}
  
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    font-family: 'Montserrat', sans-serif;
    color: ${(props) =>
      props.theme.name === "dark"
        ? props.theme.colors.white
        : props.theme.colors.primary};
    background: ${(props) => props.theme.colors.black};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }

  p {
    font-size: ${(props) => props.theme.typography.paragraph.fontSize};
    font-weight: ${(props) => props.theme.typography.paragraph.fontWeight};
    line-height: ${(props) => props.theme.typography.paragraph.lineHeight};
  }
`;

export default GlobalStyle;
