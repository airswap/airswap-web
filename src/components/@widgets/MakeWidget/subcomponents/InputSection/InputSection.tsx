import { Wrapper, StyledIconButton } from "./InputSection.styles";
import React, { FC, PropsWithChildren } from "react";

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
