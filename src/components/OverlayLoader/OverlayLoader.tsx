import { FC } from "react";

import { OverlaySpinningLoader } from "../../styled-components/Overlay/Overlay";
import { Container, StyledIcon } from "./OverlayLoader.styles";

interface OverlayLoaderProps {
  isSucceeded?: boolean;
  className?: string;
}

const OverlayLoader: FC<OverlayLoaderProps> = ({ isSucceeded, className }) => {
  return (
    <Container className={className}>
      {isSucceeded ? (
        <StyledIcon name="check-circle" />
      ) : (
        <OverlaySpinningLoader />
      )}
    </Container>
  );
};

export default OverlayLoader;
