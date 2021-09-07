import { FC } from "react";

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
   * Function to close component
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
  return (
    <Container hasTitle={!!title} isHidden={isHidden}>
      <TitleContainer>
        <StyledTitle type="h2">{title}</StyledTitle>
        <CloseButton icon="chevron-down" iconSize={1} onClick={onClose} />
      </TitleContainer>
      <ContentContainer>{children}</ContentContainer>
    </Container>
  );
};

export default Overlay;
