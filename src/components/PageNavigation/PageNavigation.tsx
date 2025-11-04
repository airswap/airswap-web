import { FC } from "react";
import { useTranslation } from "react-i18next";

import { AppRoutes, routes } from "../../routes";
import { Container, StyledNavLink } from "./PageNavigation.styles";

interface PageNavigationProps {
  className?: string;
}

const PageNavigation: FC<PageNavigationProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <StyledNavLink
        to={routes.swap()}
        isActive={(match, location) => {
          return (
            location.pathname.includes(AppRoutes.swap) ||
            location.pathname === "/"
          );
        }}
      >
        {t("common.rfq")}
      </StyledNavLink>
      <StyledNavLink
        to={routes.makeOtcOrder()}
        isActive={(match, location) => {
          return (
            location.pathname.includes(AppRoutes.myOtcOrders) ||
            location.pathname.includes(AppRoutes.makeOtcOrder) ||
            location.pathname.includes(AppRoutes.otcOrder) ||
            location.pathname.includes(AppRoutes.limitOrder)
          );
        }}
      >
        {t("common.otc")}
      </StyledNavLink>
    </Container>
  );
};

export default PageNavigation;
