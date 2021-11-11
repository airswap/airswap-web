import { FC } from "react";

import { AnimatePresence, useReducedMotion } from "framer-motion";

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
};

export const overlayShowHideAnimationDuration = 0.3;

const Overlay: FC<OverlayProps> = ({
  onClose,
  title = "",
  isHidden = true,
  subTitle = "",
  children,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Container hasTitle={!!title} isHidden={isHidden}>
      <TitleContainer>
        <TitleSubContainer>
          <StyledTitle type="h2">{title}</StyledTitle>
          {!!subTitle && (
            <StyledInfoSubHeading>{subTitle}</StyledInfoSubHeading>
          )}
        </TitleSubContainer>
        <CloseButton
          icon="chevron-down"
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
              duration: shouldReduceMotion
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
