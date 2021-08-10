import { createGlobalStyle } from "styled-components/macro";

import convertHexToRGBA from "../helpers/transformHexToRgba";
import breakPoints from "./breakpoints";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    color: ${(props) => props.theme.colors.white};
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

  .ReactModal__Overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    background: ${(props) =>
      convertHexToRGBA(props.theme.colors.alwaysBlack, 0.5)};
      
    @media ${breakPoints.tabletPortraitUp} {
      padding: 2.5rem;
    }
    
  }

  .ReactModal__Content {
    position: relative !important;
    border-radius: 0.125rem;
    width: 100%;
    max-width: 25rem;
    padding: 1.5rem;
    background: ${(props) => props.theme.colors.grey};
  }
`;

export default GlobalStyle;
