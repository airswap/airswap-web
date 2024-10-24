import { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../../../app/hooks";
import { AppRoutes } from "../../../routes";
import { selectMyOrdersReducer } from "../../myOrders/myOrdersSlice";
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

  const { userOrders } = useAppSelector(selectMyOrdersReducer);

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
        to={`/${userOrders.length ? AppRoutes.myOrders : AppRoutes.make}`}
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
      <NavigationLink
        href="https://dune.com/airswap/airswap-v3"
        target="_blank"
      >
        {t("common.stats")}
      </NavigationLink>
    </Container>
  );
};

export default SiteNavigation;
