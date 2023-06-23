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
  state: MakeWidgetState;
  onExpiryChange: (date: number) => void;
};

const MakeWidgetHeader: FC<MakeWidgetHeaderProps> = ({
  hideExpirySelector = false,
  state,
  onExpiryChange,
}) => {
  const { t } = useTranslation();
  const title =
    state === MakeWidgetState.review ? t("common.review") : t("common.make");

  return (
    <StyledWidgetHeader state={state}>
      <Title type="h2" as="h1">
        {title}
      </Title>
      <StyledExpirySelector
        onChange={onExpiryChange}
        hideExpirySelector={hideExpirySelector}
      />
    </StyledWidgetHeader>
  );
};

export default MakeWidgetHeader;
