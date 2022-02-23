import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import useMediaQuery from "../../helpers/useMediaQuery";
import useWindowSize from "../../helpers/useWindowSize";
import { AppRoutes } from "../../routes";
import breakPoints from "../../style/breakpoints";
import { InformationModalType } from "../InformationModals/InformationModals";
import {
  StyledAirswapButton,
  ToolbarButtonsContainer,
  ToolbarContainer,
} from "./Toolbar.styles";
import ToolbarButton from "./subcomponents/ToolbarButton/ToolbarButton";
import ToolbarMobileTopBar from "./subcomponents/ToolbarMobileTopBar/ToolbarMobileTopBar";

export type ToolbarProps = {
  onLinkButtonClick?: (type: InformationModalType) => void;
  onAirswapButtonClick?: () => void;
  onMobileCloseButtonClick?: () => void;
  isHiddenOnMobile?: boolean;
};

export const mobileMenuShowHideAnimationDuration = 0.5;

const Toolbar: FC<ToolbarProps> = ({
  onLinkButtonClick,
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

  const onToolbarButtonClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    type: InformationModalType
  ) => {
    onMobileCloseButtonClick && onMobileCloseButtonClick();
    if (!onLinkButtonClick) {
      return;
    }

    // On smaller devices we want the mobile menu to animate out first before routing
    if (!isTabletPortraitUp) {
      e.preventDefault();
      setTimeout(
        () => onLinkButtonClick(type),
        mobileMenuShowHideAnimationDuration * 1000
      );
    }
  };

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
          text="OTC"
          href="https://trader.airswap.io/"
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
          iconName="code"
          text={t("common.build")}
          href="https://github.com/airswap"
        />
        <ToolbarButton
          iconName="learn"
          text={t("common.learn")}
          href="https://about.airswap.io/"
        />
        <ToolbarButton
          iconName="contact-support"
          text={t("common.join")}
          onClick={(e) => {
            onToolbarButtonClick(e, AppRoutes.join);
          }}
          link={AppRoutes.join}
        />
      </ToolbarButtonsContainer>
    </ToolbarContainer>
  );
};

export default Toolbar;
