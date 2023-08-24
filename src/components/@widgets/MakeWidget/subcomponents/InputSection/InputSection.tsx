import React, { FC, PropsWithChildren } from "react";

import { Wrapper, StyledIconButton } from "./InputSection.styles";

interface InfoSectionProps {
  onInfoButtonClick?: () => void;
  className?: string;
}

const InputSection: FC<PropsWithChildren<InfoSectionProps>> = ({
  children,
  onInfoButtonClick,
  className,
}) => {
  return (
    <Wrapper className={className}>
      {children}
      <StyledIconButton
        icon="information-circle-outline"
        onClick={onInfoButtonClick}
      />
    </Wrapper>
  );
};

export default InputSection;
