import styled from "styled-components/macro";

import breakPoints, { breakpointSizes } from "../../style/breakpoints";
import { sizes } from "../../style/sizes";
import SocialButtons from "../SocialButtons/SocialButtons";

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;

  @media ${breakPoints.phoneOnly},
    (max-width: 68rem) and (max-height: 41.5rem) {
    justify-content: flex-start;
    height: auto;
  }

  @media ${breakPoints.phoneOnly} {
    height: 100%;
  }
`;

export const StyledPage = styled.div`
  position: relative;
  min-width: 18rem;
  height: 100vh;
  min-height: 35rem;

  @media (min-height: 33rem) and (max-width: ${breakpointSizes.phone}) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    padding-top: 0;
    padding-bottom: 0;
  }

  @media ${breakPoints.phoneOnly} {
    width: 100%;
    min-height: auto;
    padding: 0 ${sizes.pageMobilePadding};
  }
`;

export const StyledSocialButtons = styled(SocialButtons)`
  display: flex;
  position: fixed;
  bottom: 2.25rem;
  right: 1.5rem;

  @media ${breakPoints.phoneOnly},
    (max-width: 68rem) and (max-height: 41.5rem) {
    display: flex;
    justify-content: flex-end;
    position: relative;
    bottom: 0;
    right: 0;
    width: 100%;
    padding-right: 1.5rem;
    padding-bottom: 1.5rem;
  }

  @media ${breakPoints.phoneOnly} {
    display: none;
  }
`;
