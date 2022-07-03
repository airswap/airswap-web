import React, { FC } from "react";

import { AppRoutes } from "../../routes";
import MakeWidgetHeader from "../MakeWidget/subcomponents/MakeWidgetHeader/MakeWidgetHeader";
import { Container, StyledLink } from "./MySwapWidget.styles";

const MySwapsWidget: FC = () => {
  return (
    <Container>
      <MakeWidgetHeader title="My swaps Widget" />
      <StyledLink to={AppRoutes.make}>Make</StyledLink>
    </Container>
  );
};

export default MySwapsWidget;
