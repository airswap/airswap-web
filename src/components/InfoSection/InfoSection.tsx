import React, { FC, PropsWithChildren } from "react";

import { Wrapper, StyledIconButton } from "./InfoSection.styles";

interface InfoSectionProps {
  className?: string;
}

const InfoSection: FC<PropsWithChildren<InfoSectionProps>> = ({
  children,
  className,
}) => {
  return (
    <Wrapper className={className}>
      {children}
      <StyledIconButton icon="information-circle-outline" />
    </Wrapper>
  );
};

export default InfoSection;
