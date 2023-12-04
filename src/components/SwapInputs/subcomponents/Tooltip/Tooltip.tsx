import { Container, ContentContainer, Triangle } from "./Tooltip.styles";
import { FC } from "react";

interface ToolTipProps {
  className?: string;
}

const Tooltip: FC<ToolTipProps> = ({ children, className = "" }) => {
  return (
    <Container className={className}>
      <ContentContainer>{children}</ContentContainer>
      <Triangle />
    </Container>
  );
};

export default Tooltip;
