import styled from "styled-components/macro";
import { ThemeProps } from "../../style/themes";

export const StyledH1 = styled.h1<{ theme: ThemeProps }>`
  font-size: ${(props) => props.theme.typography.title1.fontSize};
  font-weight: ${(props) => props.theme.typography.title1.fontWeight};
  line-height: ${(props) => props.theme.typography.title1.lineHeight};
`;

export const StyledH2 = styled.h2<{ theme: ThemeProps }>`
  font-size: ${(props) => props.theme.typography.title2.fontSize};
  font-weight: ${(props) => props.theme.typography.title2.fontWeight};
  line-height: ${(props) => props.theme.typography.title2.lineHeight};
`;

export const StyledH3 = styled.h3<{ theme: ThemeProps }>`
  font-size: ${(props) => props.theme.typography.title3.fontSize};
  font-weight: ${(props) => props.theme.typography.title3.fontWeight};
  line-height: ${(props) => props.theme.typography.title3.lineHeight};
`;

export const StyledH4 = styled.h4<{ theme: ThemeProps }>`
  font-size: ${(props) => props.theme.typography.title4.fontSize};
  font-weight: ${(props) => props.theme.typography.title4.fontWeight};
  line-height: ${(props) => props.theme.typography.title4.lineHeight};
`;

export const StyledSubtitle = styled.h5`
  font-size: ${(props) => props.theme.typography.subtitle.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle.fontWeight};
  line-height: ${(props) => props.theme.typography.subtitle.lineHeight};
  text-transform: uppercase;
`;

export const StyledParagraph = styled.p`
  font-size: ${(props) => props.theme.typography.paragraph.fontSize};
  font-weight: ${(props) => props.theme.typography.paragraph.fontWeight};
  line-height: ${(props) => props.theme.typography.paragraph.lineHeight};
`;
export const StyledFormLabel = styled.label`
  font-size: ${(props) => props.theme.typography.formLabel.fontSize};
  font-weight: ${(props) => props.theme.typography.formLabel.fontWeight};
  line-height: ${(props) => props.theme.typography.formLabel.lineHeight};
`;
export const StyledNavigation = styled.div`
  font-size: ${(props) => props.theme.typography.link.fontSize};
  font-weight: ${(props) => props.theme.typography.link.fontWeight};
  line-height: ${(props) => props.theme.typography.link.lineHeight};
`;
export const StyledMetadata = styled.aside`
  font-size: ${(props) => props.theme.typography.small.fontSize};
  font-weight: ${(props) => props.theme.typography.small.fontWeight};
  line-height: ${(props) => props.theme.typography.small.lineHeight};
`;
