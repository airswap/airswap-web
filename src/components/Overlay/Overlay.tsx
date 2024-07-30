import { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AnimatePresence, useReducedMotion } from "framer-motion";

import { InterfaceContext } from "../../contexts/interface/Interface";
import { useKeyPress } from "../../hooks/useKeyPress";
import CloseButton from "../../styled-components/CloseButton/CloseButton";
import {
  Container,
  StyledTitle,
  TitleContainer,
  ContentContainer,
  TitleSubContainer,
  StyledInfoSubHeading,
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
  const shouldReduceMotion = useReducedMotion();
  const [initialized, setInitialized] = useState(false);
  const animationIsDisabled = !shouldAnimate || (!isHidden && !initialized);

  const { setShowOverlay } = useContext(InterfaceContext);

  useKeyPress(onClose, ["Escape"]);

  useEffect(() => {
    setInitialized(true);
  }, []);

  useEffect(() => {
    setShowOverlay(!isHidden);
  }, [isHidden]);

  return (
    <Container hasTitle={!!title} isHidden={isHidden} className={className}>
      <TitleContainer>
        <TitleSubContainer>
          <StyledTitle type="h2" as="h1">
            {title}
          </StyledTitle>
          {!!subTitle && (
            <StyledInfoSubHeading>{subTitle}</StyledInfoSubHeading>
          )}
        </TitleSubContainer>
        <CloseButton
          icon="exit-modal"
          ariaLabel={t("common.back")}
          iconSize={1}
          tabIndex={isHidden ? -1 : 0}
          onClick={onClose}
        />
      </TitleContainer>
      <AnimatePresence>
        {!isHidden && (
          <ContentContainer
            key="content"
            transition={{
              ease: "easeOut",
              duration:
                shouldReduceMotion || animationIsDisabled
                  ? 0
                  : overlayShowHideAnimationDuration,
            }}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
          >
            {children}
          </ContentContainer>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Overlay;
