import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { Title } from "../../../../Typography/Typography";
import { StyledWidgetHeader } from "./MakeWidgetHeader.styles";

type MakeWidgetHeaderProps = {
  className?: string;
};

const MakeWidgetHeader: FC<MakeWidgetHeaderProps> = ({ className = "" }) => {
  const { t } = useTranslation();

  return (
    <StyledWidgetHeader className={className}>
      <Title type="h2" as="h1">
        {t("common.make")}
      </Title>
    </StyledWidgetHeader>
  );
};

export default MakeWidgetHeader;
