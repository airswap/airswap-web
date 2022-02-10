import "@fontsource/dm-mono/500.css";

import { createGlobalStyle } from "styled-components/macro";

import breakPoints from "./breakpoints";
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
  
  body.scroll-locked {
    overflow-y: hidden;

    @media ${breakPoints.tabletPortraitUp} {
      overflow-y: auto;
    }
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
    font-size: ${({ theme }) => theme.typography.paragraph.desktop.fontSize};
    font-weight: ${({ theme }) =>
      theme.typography.paragraph.desktop.fontWeight};
    line-height: ${({ theme }) =>
      theme.typography.paragraph.desktop.lineHeight};

    ${(props) =>
      props.theme.typography.paragraph.mobile
        ? `
      @media ${breakPoints.phoneOnly} {
        font-size: ${props.theme.typography.paragraph.mobile?.fontSize};
        font-weight: ${props.theme.typography.paragraph.mobile?.fontWeight};
        line-height: ${props.theme.typography.paragraph.mobile?.lineHeight};
      }`
        : ""}

  }
  .walletconnect-modal__headerLogo {
    width: 30px;
  } 

  .walletconnect-modal__mobile__toggle {
    color: #8a8e97;
  }
`;

export default GlobalStyle;
