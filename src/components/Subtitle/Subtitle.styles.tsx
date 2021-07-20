import styled from "styled-components/macro";
import { ThemeProps } from "../../style/themes";

export const StyledSubtitle = styled.h5<{ theme: ThemeProps }>`
  font-size: ${(props) => props.theme.typography.subtitle.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle.fontWeight};
  line-height: ${(props) => props.theme.typography.subtitle.lineHeight};
  text-transform: uppercase;
`;
