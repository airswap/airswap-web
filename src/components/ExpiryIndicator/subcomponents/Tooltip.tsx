import { FC } from "react";

import { Container, Content } from "./Tooltip.styles";

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
