import { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import {
  Container,
  NavigationLink,
  NavigationNavLink,
} from "./SiteNavigation.styles";

interface NavigationProps {
  className?: string;
}

const SiteNavigation: FC<NavigationProps> = ({ className }): ReactElement => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <NavigationNavLink to="/">{t("common.trade")}</NavigationNavLink>|
      <NavigationLink href="https://github.com/airswap" target="_blank">
        {t("common.coders")}
      </NavigationLink>
      <NavigationLink href="https://dao.airswap.eth.limo/" target="_blank">
        {t("common.voters")}
      </NavigationLink>
      <NavigationLink href="https://analytics.airswap.xyz/" target="_blank">
        {t("common.stats")}
      </NavigationLink>
    </Container>
  );
};

export default SiteNavigation;
