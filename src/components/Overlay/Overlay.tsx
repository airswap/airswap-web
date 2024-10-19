import { FC, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useWindowSize } from "usehooks-ts";

import { InterfaceContext } from "../../contexts/interface/Interface";
import useDebounce from "../../hooks/useDebounce";
import useElementSize from "../../hooks/useElementSize";
import useIsOverflowing from "../../hooks/useIsOverflowing";
import { useKeyPress } from "../../hooks/useKeyPress";
import {
  Container,
  StyledTitle,
  TitleContainer,
  ContentContainer,
  TitleSubContainer,
  StyledInfoSubHeading,
  StyledCloseButton,
} from "./Overlay.styles";

export type OverlayProps = {
  /**
   * Function to close component
   */
  onClose: () => void;
  /**
   * Title shown on top
   */
  title?: string;
  /**
   * Subtitle shown under title
   */
  subTitle?: string;
  /**
   * Hide or show the component
   */
  isHidden?: boolean;
  shouldAnimate?: boolean;
  hasDynamicHeight?: boolean;
  className?: string;
};

export const overlayShowHideAnimationDuration = 0.3;

const Overlay: FC<OverlayProps> = ({
  onClose,
  title = "",
  isHidden = true,
  subTitle = "",
  shouldAnimate = true,
  children,
  className = "",
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { showOverlay, setShowOverlay } = useContext(InterfaceContext);
  const [isAnimatedOut, setIsAnimatedOut] = useState(false);
  const { height: containerHeight } = useWindowSize();
  const { height: contentHeight } = useElementSize(contentRef);
  const paddingBlock = 32;
  const contentY = Math.max(
    0,
    (containerHeight - paddingBlock * 2 - contentHeight) / 2
  );

  useKeyPress(onClose, ["Escape"]);

  useEffect(() => {
    setIsAnimatedOut(false);

    if (isHidden) {
      setShowOverlay(false);
    }
  }, [isHidden]);

  useDebounce(
    () => {
      // Make sure the animation ended before setting the showOverlay state
      setShowOverlay(!isHidden);

      if (isHidden) {
        setIsAnimatedOut(true);
      }
    },
    250,
    [isHidden]
  );

  return createPortal(
    <Container
      ref={ref}
      hasTitle={!!title}
      hasOverflow={!contentY}
      isHidden={isHidden}
      showScrollbar={!!showOverlay && !isHidden}
      style={{
        visibility: isAnimatedOut ? "hidden" : "visible",
      }}
      className={className}
    >
      <ContentContainer
        isHidden={isHidden}
        ref={contentRef}
        style={{
          marginTop: `${contentY}px`,
        }}
      >
        <TitleContainer>
          <TitleSubContainer>
            <StyledTitle type="h2" as="h1">
              {title}
            </StyledTitle>
            {!!subTitle && (
              <StyledInfoSubHeading>{subTitle}</StyledInfoSubHeading>
            )}
          </TitleSubContainer>
          <StyledCloseButton
            icon="exit-modal"
            ariaLabel={t("common.back")}
            iconSize={1}
            tabIndex={isHidden ? -1 : 0}
            onClick={onClose}
          />
        </TitleContainer>
        {children}
      </ContentContainer>
    </Container>,
    document.getElementById("root") as HTMLElement
  );
};

export default Overlay;
