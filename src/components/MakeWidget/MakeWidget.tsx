import React, { FC } from "react";

import { Container } from "./MakeWidget.styles";
import MakeWidgetHeader from "./subcomponents/MakeWidgetHeader/MakeWidgetHeader";

const MakeWidget: FC = () => {
  return (
    <Container>
      <MakeWidgetHeader title="Make" />
    </Container>
  );
};

export default MakeWidget;
