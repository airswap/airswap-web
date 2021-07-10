import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';
import SiteLogo from '../SiteLogo/SiteLogo';

export const StyledPage = styled.div<{ theme: ThemeProps }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100vh;
  min-height: 50rem;
`;

export const StyledSiteLogo = styled(SiteLogo)<{ theme: ThemeProps }>`
  position: absolute;
  top: 3.75rem;
  left: 3.125rem;
`;
