import { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import { AppRoutes } from "../../../routes";
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
      <NavigationNavLink
        to={`/${AppRoutes.swap}`}
        isActive={(match, location) => {
          return (
            location.pathname.includes(AppRoutes.swap) ||
            location.pathname === "/"
          );
        }}
      >
        {t("common.rfq")}
      </NavigationNavLink>
      <NavigationNavLink
        to={`/${AppRoutes.myOrders}`}
        isActive={(match, location) => {
          return (
            location.pathname.includes(AppRoutes.myOrders) ||
            location.pathname.includes(AppRoutes.make) ||
            location.pathname.includes(AppRoutes.order)
          );
        }}
      >
        {t("common.otc")}
      </NavigationNavLink>
      <NavigationLink href="https://analytics.airswap.xyz/" target="_blank">
        {t("common.stats")}
      </NavigationLink>
    </Container>
  );
};

export default SiteNavigation;
