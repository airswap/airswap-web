import { FC, useState } from "react";

import { icons } from "../Icon/Icon";
import {
  Container,
  SocialButton,
  StyledIcon,
  PlainLink,
  Divider,
} from "./SocialButtons.styles";

type Destination = {
  icon: keyof typeof icons;
  primary: string;
  locales?: Record<string, string>;
};

const destinations: Destination[] = [
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

type SocialButtonsProps = {
  className?: string;
};

const SocialButtons: FC<SocialButtonsProps> = ({ className = "" }) => {
  const [hoveredIcon, setHoveredIcon] = useState<keyof typeof icons | null>(
    null
  );
  const [hoveredLocale, setHoveredLocale] = useState<string | null>(null);
  const [userIsUsingTouch, setUserIsUsingTouch] = useState(false);

  const handleSocialButtonTouchStart = (dest: Destination) => {
    setUserIsUsingTouch(true);
    setHoveredIcon(hoveredIcon ? null : dest.icon);
  };

  const handleSocialButtonMouseEnter = (dest: Destination) => {
    setHoveredIcon(dest.icon);
  };

  const handleSocialButtonMouseLeave = () => {
    if (!userIsUsingTouch) {
      setHoveredIcon(null);
    }
  };

  return (
    <Container className={className}>
      {destinations.map((dest) => {
        const locales = Object.keys(dest.locales || {});

        if (!locales.length) {
          return (
            <SocialButton
              as="a"
              aria-label={`${dest.icon}`}
              key={dest.icon}
              showLocales={hoveredIcon === dest.icon ? locales.length : 0}
              onMouseEnter={() => handleSocialButtonMouseEnter(dest)}
              onMouseLeave={handleSocialButtonMouseLeave}
              onTouchStart={() => handleSocialButtonTouchStart(dest)}
              href={dest.primary}
              target="_blank"
              rel="noreferrer"
            >
              <StyledIcon
                iconSize={1}
                name={dest.icon}
                $deEmphasize={hoveredIcon !== null && hoveredIcon !== dest.icon}
              />
            </SocialButton>
          );
        }

        return (
          <SocialButton
            as="div"
            key={dest.icon}
            showLocales={hoveredIcon === dest.icon ? locales.length : 0}
            onMouseLeave={handleSocialButtonMouseLeave}
          >
            {hoveredIcon === dest.icon && locales.length !== 0 && (
              <>
                {locales.map((locale) => (
                  <PlainLink
                    onMouseEnter={setHoveredLocale.bind(null, locale)}
                    onMouseLeave={setHoveredLocale.bind(null, null)}
                    $deEmphasize={hoveredLocale !== locale}
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
            <button
              aria-label={`${dest.icon}`}
              onMouseEnter={() => handleSocialButtonMouseEnter(dest)}
              onTouchStart={() => handleSocialButtonTouchStart(dest)}
            >
              <StyledIcon
                iconSize={1}
                name={dest.icon}
                $deEmphasize={hoveredIcon !== null && hoveredIcon !== dest.icon}
              />
            </button>
          </SocialButton>
        );
      })}
    </Container>
  );
};

export default SocialButtons;
