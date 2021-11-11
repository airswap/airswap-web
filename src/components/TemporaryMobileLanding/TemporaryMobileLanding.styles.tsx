import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";

export const Container = styled.div`
  color: ${(props) => props.theme.colors.white};
  padding: 0 1.375rem;
  width: 100vw;
  min-height: 100%;
  position: relative;
  display: none;
  @media ${breakPoints.phoneOnly} {
    display: block;
  }
  @media ${breakPoints.phoneLandscape} {
    display: block;
  }
`;

export const LogoHeader = styled.div`
  margin: 1rem 0;
  height: 5rem;
`;

export const AirSwapLogo = styled.div`
  width: 100%;
  height: 5rem;
  background-image: url("images/airswap-logo.png");
  background-position: left center;
  background-size: 145px 33px;
  background-repeat: no-repeat;
`;

export const Title = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  width: 15.25rem;
`;

export const Subtitle = styled.h2`
  font-size: 1rem;
  font-weight: 400;
  width: 100%;
  color: ${(props) => props.theme.colors.darkSubText};
  margin: 1rem 0;
`;

export const SocialsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 1rem 0;
`;

export const Socials = styled.a`
  display: flex;
  align-items: center;
  width: 100%;
  height: 2.375rem;
  padding: 0.625rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};

  &:not(:nth-child(1)) {
    border-top: none;
  }
`;

export const SocialTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  flex-grow: 1;
  margin-left: 1rem;
`;

export const MobileContainer = styled.div`
  margin-top: 2.25rem;
  width: 11.5rem;

  @media (orientation: landscape) {
    width: 100%;
    margin-bottom: 2rem;
  }
`;

export const DexTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin: 1rem 0;
`;

export const Description = styled.h3`
  color: ${(props) => props.theme.colors.darkSubText};
`;

export const BackgroundImage = styled.div`
  position: absolute;
  bottom: -60px;
  right: 0;
  width: 100%;
  height: 80%;
  background-image: url("images/background-mobile.png");
  background-position: right bottom;
  background-repeat: no-repeat;
  background-size: 360px 227px;
  z-index: -1;

  display: none;

  @media ${breakPoints.phoneOnly} {
    display: block;
  }

  @media (orientation: landscape) {
    top: -205px;
    right: 1.375rem;
    bottom: unset;
    display: block;
  }
`;
