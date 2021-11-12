import Icon from "../Icon/Icon";
import {
  AirSwapLogo,
  BackgroundImage,
  Container,
  Description,
  LogoHeader,
  MobileContainer,
  Socials,
  SocialsContainer,
  Subtitle,
  Title,
  DexTitle,
  SocialTitle,
} from "./TemporaryMobileLanding.styles";

const socialsList = [
  {
    iconName: "learn",
    title: "learn",
    link: "https://about.airswap.io/",
  },
  {
    iconName: "vote",
    title: "vote",
    link: "https://activate.codefi.network/staking/airswap/governance",
  },
  {
    iconName: "medium",
    title: "blog",
    link: "https://blog.airswap.io/",
  },
  {
    iconName: "twitter",
    title: "twitter",
    link: "https://twitter.com/airswap",
  },
  {
    iconName: "discord",
    title: "discord",
    link: "https://chat.airswap.io/",
  },
];

const TemporaryMobileLanding = () => {
  return (
    <Container>
      <LogoHeader>
        <AirSwapLogo />
      </LogoHeader>
      <Title>AirSwap powers peer-to-peer trading.</Title>
      <Subtitle>Please select a destination</Subtitle>
      <SocialsContainer>
        {socialsList.map((social) => {
          return (
            <Socials
              href={social.link}
              target="_blank"
              rel="noreferrer"
              key={social.title}
            >
              <Icon name={social.iconName} />
              <SocialTitle>{social.title.toUpperCase()}</SocialTitle>
              <Icon name="transaction-link" />
            </Socials>
          );
        })}
      </SocialsContainer>
      <MobileContainer>
        <DexTitle>New P2P DEX</DexTitle>
        <Description>
          To swap tokens on the new DEX, visit this site using your desktop
          computer.
        </Description>
      </MobileContainer>

      <BackgroundImage />
    </Container>
  );
};

export default TemporaryMobileLanding;
