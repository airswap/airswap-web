import { FC, useState } from "react";

import { icons } from "../Icon/Icon";
import {
  Container,
  SocialButton,
  StyledIcon,
  PlainLink,
  Divider,
} from "./SocialButtons.styles";

const destinations: {
  icon: keyof typeof icons;
  primary: string;
  locales?: Record<string, string>;
}[] = [
  {
    icon: "twitter",
    primary: "https://twitter.com/airswap",
    locales: {
      en: "https://twitter.com/airswap",
      fr: "https://twitter.com/airswap_fr",
    },
  },
  {
    icon: "discord",
    primary: "https://chat.airswap.io/",
  },
  {
    icon: "medium",
    primary: "https://blog.airswap.io/",
  },
  {
    icon: "telegram",
    primary: "https://t.me/airswapofficial",
    locales: {
      en: "https://t.me/airswapofficial",
      fr: "https://t.me/AirSwap_france",
    },
  },
];

const SocialButtons: FC<{}> = () => {
  const [hoveredIcon, setHoveredIcon] = useState<keyof typeof icons | null>(
    null
  );
  const [hoveredLocale, setHoveredLocale] = useState<string | null>(null);

  return (
    <Container>
      {destinations.map((dest) => {
        const locales = Object.keys(dest.locales || {});
        return (
          <SocialButton
            key={dest.icon}
            onPointerEnter={setHoveredIcon.bind(null, dest.icon)}
            onPointerLeave={setHoveredIcon.bind(null, null)}
            showLocales={hoveredIcon === dest.icon ? locales.length : 0}
          >
            {hoveredIcon === dest.icon && locales.length !== 0 && (
              <>
                {locales.map((locale) => (
                  <PlainLink
                    onPointerEnter={setHoveredLocale.bind(null, locale)}
                    onPointerLeave={setHoveredLocale.bind(null, null)}
                    $deEmphasize={
                      hoveredLocale !== null && hoveredLocale !== locale
                    }
                    href={dest.locales?.[locale]}
                    key={`${dest.icon}-${locale}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {locale}
                  </PlainLink>
                ))}
                <Divider />
              </>
            )}
            <a href={dest.primary} target="_blank" rel="noreferrer">
              <StyledIcon
                iconSize={1}
                name={dest.icon}
                $deEmphasize={hoveredIcon !== null && hoveredIcon !== dest.icon}
              />
            </a>
          </SocialButton>
        );
      })}
    </Container>
  );
};

export default SocialButtons;
