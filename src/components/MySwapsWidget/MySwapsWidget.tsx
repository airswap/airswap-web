import React, { FC } from "react";

import { AppRoutes } from "../../routes";
import { Container, StyledLink } from "./MySwapWidget.styles";

const MySwapsWidget: FC = () => {
  return (
    <Container>
      My swaps Widget
      <StyledLink to={AppRoutes.make}>Make</StyledLink>
    </Container>
  );
};

export default MySwapsWidget;
