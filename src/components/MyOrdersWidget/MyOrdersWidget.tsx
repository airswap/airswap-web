import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { AppRoutes } from "../../routes";
import { Container, StyledLink } from "./MyOrdersWidget.styles";
import MyOrdersWidgetHeader from "./subcomponents/MyOrdersWidgetHeader/MyOrdersWidgetHeader";

const MyOrdersWidget: FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <MyOrdersWidgetHeader title={t("common.myOrders")} />
      <StyledLink to={AppRoutes.make}>{t("common.makeOrder")}</StyledLink>
    </Container>
  );
};

export default MyOrdersWidget;
