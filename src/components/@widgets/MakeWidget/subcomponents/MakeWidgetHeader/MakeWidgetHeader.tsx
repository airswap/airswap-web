import { Title } from "../../../../Typography/Typography";
import {
  StyledExpirySelector,
  StyledWidgetHeader,
} from "./MakeWidgetHeader.styles";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

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
