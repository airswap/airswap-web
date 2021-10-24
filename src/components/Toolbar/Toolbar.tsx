import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  IconAirswap,
  ToolbarButtonsContainer,
  ToolbarContainer,
} from "./Toolbar.styles";
import ToolbarButton from "./subcomponents/ToolbarButton/ToolbarButton";

const Toolbar: FC = () => {
  const { t } = useTranslation(["common"]);

  // TODO: Add content for "about" in modals

  return (
    <ToolbarContainer>
      <IconAirswap iconSize={2.5} name="airswap" />
      <ToolbarButtonsContainer>
        {/*<ToolbarButton iconName="bars" text={t("common:stats")} />*/}
        <ToolbarButton
          iconName="vote"
          text={t("common:vote")}
          href="https://activate.codefi.network/staking/airswap/governance"
        />
        <ToolbarButton
          iconName="code"
          text={t("common:build")}
          href="https://github.com/airswap/airswap-web"
        />
        <ToolbarButton
          iconName="about"
          text={t("common:about")}
          href="https://about.airswap.io/"
        />
        <ToolbarButton iconName="contact-support" text={t("common:join")} />
      </ToolbarButtonsContainer>
    </ToolbarContainer>
  );
};

export default Toolbar;
