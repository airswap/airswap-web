import { createGlobalStyle } from 'styled-components/macro';
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

  p {
    font-size: ${(props) => props.theme.typography.paragraph.fontSize};
    font-weight: ${(props) => props.theme.typography.paragraph.fontWeight};
    line-height: ${(props) => props.theme.typography.paragraph.lineHeight};
  }
`;

export default GlobalStyle;
