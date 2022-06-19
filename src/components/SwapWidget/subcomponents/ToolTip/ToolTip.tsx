import { FC } from "react";

import {
  Container,
  ContentContainer,
  Square,
  Triangle,
} from "./ToolTip.styles";

interface ToolTipProps {
  className?: string;
}

const ToolTip: FC<ToolTipProps> = ({ children, className = "" }) => {
  return (
    <Container className={className}>
      <ContentContainer>{children}</ContentContainer>
      <Triangle>
        <Square />
      </Triangle>
    </Container>
  );
};

export default ToolTip;
