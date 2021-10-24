import React, { FC } from "react";

import Icon from "../../../Icon/Icon";
import { Text, ToolbarButtonContainer } from "./ToolbarButton.styles";

type ToolbarButtonProps = {
  text: string;
  iconName: string;
};

const ToolbarButton: FC<ToolbarButtonProps> = ({ text, iconName }) => {
  return (
    <ToolbarButtonContainer>
      <Icon name={iconName} iconSize={1.5} />
      <Text>{text}</Text>
    </ToolbarButtonContainer>
  );
};

export default ToolbarButton;
