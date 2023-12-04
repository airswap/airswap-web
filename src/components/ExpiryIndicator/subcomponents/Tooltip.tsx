import { Container, Content } from "./Tooltip.styles";
import { FC } from "react";

interface ToolTipProps {
  className?: string;
}

const Tooltip: FC<ToolTipProps> = ({ children, className = "" }) => {
  return (
    <Container className={className}>
      <Content>{children}</Content>
    </Container>
  );
};

export default Tooltip;
