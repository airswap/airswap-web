import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';
import SiteLogo from '../SiteLogo/SiteLogo';
import breakPoints from '../../style/breakpoints';
import { sizes } from '../../style/sizes';

export const StyledPage = styled.div<{ theme: ThemeProps }>`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  min-height: 100vh;
  padding: 2rem 0;

  @media ${breakPoints.tabletLandscapeUp} {
    padding-right: ${sizes.sideBarWidth};
  }
  
  @media (min-height: 50rem) {
    align-items: center;
    height: 100vh;
    min-height: 50rem;
  }
`;

export const StyledSiteLogo = styled(SiteLogo)<{ theme: ThemeProps }>`
  position: absolute;
  top: 3.75rem;
  left: 3.125rem;
`;
