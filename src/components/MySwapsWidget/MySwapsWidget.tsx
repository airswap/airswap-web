import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { AppRoutes } from "../../routes";
import MakeWidgetHeader from "../MakeWidget/subcomponents/MakeWidgetHeader/MakeWidgetHeader";
import { Container, StyledLink } from "./MySwapWidget.styles";

const MySwapsWidget: FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <MakeWidgetHeader title={t("common.mySwaps")} />
      <StyledLink to={AppRoutes.make}>{t("common.makeSwap")}</StyledLink>
    </Container>
  );
};

export default MySwapsWidget;
