import React, { FC } from "react";

import { WidgetHeader } from "../../../../styled-components/WidgetHeader/WidgetHeader";
import { Title } from "../../../Typography/Typography";

type MakeWidgetHeaderProps = {
  title: string;
};

const MyOrdersWidgetHeader: FC<MakeWidgetHeaderProps> = ({ title }) => {
  return (
    <WidgetHeader>
      <Title type="h2" as="h1">
        {title}
      </Title>
    </WidgetHeader>
  );
};

export default MyOrdersWidgetHeader;
