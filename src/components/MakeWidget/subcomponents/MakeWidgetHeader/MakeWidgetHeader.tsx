import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { WidgetHeader } from "../../../../styled-components/WidgetHeader/WidgetHeader";
import { Title } from "../../../Typography/Typography";
import { MakeWidgetState } from "../../MakeWidget";
import {
  StyledExpirySelector,
  StyledWidgetHeader,
} from "./MakeWidgetHeader.styles";

type MakeWidgetHeaderProps = {
  hideExpirySelector?: boolean;
  onExpiryChange: (date: number) => void;
};

const MakeWidgetHeader: FC<MakeWidgetHeaderProps> = ({
  hideExpirySelector = false,
  onExpiryChange,
}) => {
  const { t } = useTranslation();

  return (
    <StyledWidgetHeader>
      <Title type="h2" as="h1">
        {t("common.make")}
      </Title>
      <StyledExpirySelector
        onChange={onExpiryChange}
        hideExpirySelector={hideExpirySelector}
      />
    </StyledWidgetHeader>
  );
};

export default MakeWidgetHeader;
