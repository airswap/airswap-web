import React, { FC, PropsWithChildren } from "react";

import { Container, StyledIcon } from "./InfoSection.styles";

interface InfoSectionProps {
  className?: string;
}

const InfoSection: FC<PropsWithChildren<InfoSectionProps>> = ({
  children,
  className,
}) => {
  return (
    <Container className={className}>
      {children}
      <StyledIcon name="information-circle-outline" />
    </Container>
  );
};

export default InfoSection;
