import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";

export const Container = styled.div`
  color: ${(props) => props.theme.colors.white};
  padding: 2rem 1.375rem;
  width: 100vw;
  overflow-x: hidden;
  display: none @media ${breakPoints.phoneOnly} {
    display: block;
  }
`;

export const LogoHeader = styled.div`
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
  display: none;
  position: absolute;
  bottom: 8.5rem;
  left: 0rem;
  width: 100%;
  height: 80%;
  background-image: url("images/background-tokens.png");
  background-position: right bottom;
  background-repeat: no-repeat;
  background-size: 365px 400px;
  z-index: -1;

  @media ${breakPoints.phoneOnly} {
    display: block;
  }
`;
