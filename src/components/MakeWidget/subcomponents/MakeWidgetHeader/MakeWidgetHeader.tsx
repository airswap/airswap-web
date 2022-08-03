import React, { FC } from "react";

import { WidgetHeader } from "../../../../styled-components/WidgetHeader/WidgetHeader";
import { Title } from "../../../Typography/Typography";
import { ExpirySelector } from "../ExpirySelector/ExpirySelector";

type MakeWidgetHeaderProps = {
  title: string;
};

const MakeWidgetHeader: FC<MakeWidgetHeaderProps> = ({ title }) => {
  return (
    <WidgetHeader>
      <Title type="h2" as="h1">
        {title}
      </Title>
      <ExpirySelector onChange={(value) => console.log(value)} />
    </WidgetHeader>
  );
};

export default MakeWidgetHeader;
