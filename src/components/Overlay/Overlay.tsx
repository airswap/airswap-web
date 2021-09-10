import { FC } from "react";

import { AnimatePresence, useReducedMotion } from "framer-motion";

import CloseButton from "../../styled-components/CloseButton/CloseButton";
import {
  Container,
  StyledTitle,
  TitleContainer,
  ContentContainer,
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
   * Hide or show the component
   */
  isHidden?: boolean;
};

const Overlay: FC<OverlayProps> = ({
  onClose,
  title = "",
  isHidden = true,
  children,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Container hasTitle={!!title} isHidden={isHidden}>
      <TitleContainer>
        <StyledTitle type="h2">{title}</StyledTitle>
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
              duration: shouldReduceMotion ? 0 : 0.3,
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
