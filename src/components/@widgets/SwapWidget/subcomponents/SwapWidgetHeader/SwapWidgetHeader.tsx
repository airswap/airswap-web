import { FC } from "react";
import { useTranslation } from "react-i18next";

import { WidgetHeader } from "../../../../../styled-components/WidgetHeader/WidgetHeader";
import { Title } from "../../../../Typography/Typography";

interface SwapWidgetHeaderProps {
  className?: string;
}

const SwapWidgetHeader: FC<SwapWidgetHeaderProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <WidgetHeader className={className}>
      <Title type="h2" as="h1">
        {t("common.rfq")}
      </Title>
    </WidgetHeader>
  );
};

export default SwapWidgetHeader;
