import React, { FC } from "react";

import { GuideButtonContainer, StyledIcon, Text } from "./GuideButton.styles";

export interface GuideButtonProps {
  iconName: string;
  text: string;
  href: string;
}

const GuideButton: FC<GuideButtonProps> = ({ iconName, text, href }) => {
  return (
    <GuideButtonContainer target="_blank" href={href}>
      <StyledIcon name={iconName} iconSize={1.5} />
      <Text>{text}</Text>
    </GuideButtonContainer>
  );
};

export default GuideButton;
