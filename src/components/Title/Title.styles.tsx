import styled from 'styled-components/macro';
import { ThemeProps } from '../../style/themes';

export const StyledH1 = styled.h1<{ theme: ThemeProps }>`
  font-size: ${props => props.theme.typography.title1.fontSize};
  font-weight: ${props => props.theme.typography.title1.fontWeight};
  line-height: ${props => props.theme.typography.title1.lineHeight};
`;

export const StyledH2 = styled.h2<{ theme: ThemeProps }>`
  font-size: ${props => props.theme.typography.title2.fontSize};
  font-weight: ${props => props.theme.typography.title2.fontWeight};
  line-height: ${props => props.theme.typography.title2.lineHeight};
`;

export const StyledH3 = styled.h2<{ theme: ThemeProps }>`
  font-size: ${props => props.theme.typography.title3.fontSize};
  font-weight: ${props => props.theme.typography.title3.fontWeight};
  line-height: ${props => props.theme.typography.title3.lineHeight};
`;

export const StyledH4 = styled.h2<{ theme: ThemeProps }>`
  font-size: ${props => props.theme.typography.title4.fontSize};
  font-weight: ${props => props.theme.typography.title4.fontWeight};
  line-height: ${props => props.theme.typography.title4.lineHeight};
`;
