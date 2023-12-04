import { WidgetHeader } from "../../../../../styled-components/WidgetHeader/WidgetHeader";
import { Title } from "../../../../Typography/Typography";
import React, { FC } from "react";

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
