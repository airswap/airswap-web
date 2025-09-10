import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../../app/hooks";
import { getDelegateContract } from "../../entities/DelegateRule/DelegateRuleHelpers";
import { selectDelegateRulesReducer } from "../../features/delegateRules/delegateRulesSlice";
import { selectMyOtcOrdersReducer } from "../../features/myOtcOrders/myOtcOrdersSlice";
import { AppRoutes, routes } from "../../routes";
import { Container, StyledNavLink } from "./PageNavigation.styles";

interface PageNavigationProps {
  className?: string;
}

const PageNavigation: FC<PageNavigationProps> = ({ className }) => {
  const { t } = useTranslation();
  const { provider } = useWeb3React();
  const { chainId } = useAppSelector((state) => state.web3);
  const userHasOrders =
    useSelector(selectMyOtcOrdersReducer).userOrders.length > 0;
  const userHasLimitOrders =
    useSelector(selectDelegateRulesReducer).delegateRules.length > 0;
  const isDelegateRuleSupported =
    provider && chainId ? getDelegateContract(provider, chainId) : true;

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
        to={userHasOrders ? routes.myOtcOrders() : routes.makeOtcOrder()}
        isActive={(match, location) => {
          return (
            location.pathname.includes(AppRoutes.myOtcOrders) ||
            location.pathname.includes(AppRoutes.makeOtcOrder) ||
            (location.pathname.includes(AppRoutes.otcOrder) &&
              !location.pathname.includes(AppRoutes.limitOrder))
          );
        }}
      >
        {t("common.otc")}
      </StyledNavLink>
      {isDelegateRuleSupported && (
        <StyledNavLink
          to={
            userHasLimitOrders
              ? routes.myLimitOrders()
              : routes.makeLimitOrder()
          }
          isActive={(match, location) => {
            return (
              location.pathname.includes(AppRoutes.myLimitOrders) ||
              location.pathname.includes(AppRoutes.makeLimitOrder) ||
              location.pathname.includes(AppRoutes.limitOrder)
            );
          }}
        >
          {t("common.limit")}
        </StyledNavLink>
      )}
    </Container>
  );
};

export default PageNavigation;
