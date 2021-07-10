import { createGlobalStyle } from 'styled-components';
import { ThemeProps } from './themes';

const GlobalStyle = createGlobalStyle<{ theme: ThemeProps }>`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    color: ${props => props.theme.colors.white};
    background: ${props => props.theme.colors.black};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
`;

export default GlobalStyle;
