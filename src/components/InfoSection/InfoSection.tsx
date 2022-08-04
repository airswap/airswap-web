import React, { FC, PropsWithChildren } from "react";

import { Wrapper, StyledIcon } from "./InfoSection.styles";

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
      <StyledIcon name="information-circle-outline" />
    </Wrapper>
  );
};

export default InfoSection;
