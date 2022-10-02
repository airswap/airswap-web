import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import useMediaQuery from "../../hooks/useMediaQuery";
import useWindowSize from "../../hooks/useWindowSize";
import { AppRoutes } from "../../routes";
import breakPoints from "../../style/breakpoints";
import {
  StyledAirswapButton,
  StyledSocialButtons,
  ToolbarButtonsContainer,
  ToolbarContainer,
} from "./Toolbar.styles";
import ToolbarButton from "./subcomponents/ToolbarButton/ToolbarButton";
import ToolbarMobileTopBar from "./subcomponents/ToolbarMobileTopBar/ToolbarMobileTopBar";

export type ToolbarProps = {
  onAirswapButtonClick?: () => void;
  onMobileCloseButtonClick?: () => void;
  isHiddenOnMobile?: boolean;
};

export const mobileMenuShowHideAnimationDuration = 0.5;

const Toolbar: FC<ToolbarProps> = ({
  onAirswapButtonClick,
  onMobileCloseButtonClick,
  isHiddenOnMobile,
}) => {
  const { t } = useTranslation();
  const { width, height } = useWindowSize();
  const isTabletPortraitUp = useMediaQuery(breakPoints.tabletPortraitUp);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileTopBarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    if (
      containerRef.current &&
      mobileTopBarRef.current &&
      scrollContainerRef.current
    ) {
      const { scrollHeight, offsetTop } = scrollContainerRef.current;
      setOverflow(scrollHeight + offsetTop > containerRef.current.offsetHeight);
    }
  }, [containerRef, mobileTopBarRef, scrollContainerRef, width, height]);

  return (
    <ToolbarContainer
      ref={containerRef}
      $overflow={overflow}
      $isHiddenOnMobile={isHiddenOnMobile || isTabletPortraitUp}
    >
      <ToolbarMobileTopBar
        toolbarRef={mobileTopBarRef}
        onAirswapButtonClick={onAirswapButtonClick}
        onCloseButtonClick={onMobileCloseButtonClick}
      />
      <StyledAirswapButton
        onClick={onAirswapButtonClick}
        ariaLabel={t("common.AirSwap")}
        icon="airswap"
        iconSize={2.5}
      />
      <ToolbarButtonsContainer ref={scrollContainerRef} $overflow={overflow}>
        <ToolbarButton
          iconName="swap-horizontal"
          iconSize={1.25}
          text={t("common.swap")}
          link={AppRoutes.swap}
        />
        <ToolbarButton
          iconName="plus"
          iconSize={0.875}
          text={t("common.make")}
          link={AppRoutes.myOrders}
        />
        <ToolbarButton
          iconName="bars"
          text={t("common.stats")}
          href="https://dune.xyz/agrimony/AirSwap-v2"
        />
        <ToolbarButton
          iconName="vote"
          text={t("common.vote")}
          href="https://activate.codefi.network/staking/airswap/governance"
        />
        <ToolbarButton
          iconName="contact-support"
          text={t("common.join")}
          href="https://about.airswap.io/community/onboarding"
        />
        <StyledSocialButtons />
      </ToolbarButtonsContainer>
    </ToolbarContainer>
  );
};

export default Toolbar;
