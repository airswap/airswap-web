import React, { FC } from "react";

import { WidgetHeader } from "../../../../styled-components/WidgetHeader/WidgetHeader";
import { Title } from "../../../Typography/Typography";
import { StyledExpirySelector } from "./MakeWidgetHeader.styles";

type MakeWidgetHeaderProps = {
  title: string;
  onExpiryChange: (date: number) => void;
};

const MakeWidgetHeader: FC<MakeWidgetHeaderProps> = ({
  title,
  onExpiryChange,
}) => {
  return (
    <WidgetHeader>
      <Title type="h2" as="h1">
        {title}
      </Title>
      <StyledExpirySelector onChange={onExpiryChange} />
    </WidgetHeader>
  );
};

export default MakeWidgetHeader;
