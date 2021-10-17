import React, { FC } from "react";

import Icon from "../../../Icon/Icon";
import {
  Text,
  ToolBarAnchorContainer,
  ToolbarButtonContainer,
} from "./ToolbarButton.styles";

type ToolbarButtonProps = {
  text: string;
  iconName: string;
  href?: string;
  onClick?: () => void;
};

const ToolbarButton: FC<ToolbarButtonProps> = ({
  text,
  iconName,
  href,
  onClick,
}) => {
  const renderInner = () => {
    return (
      <>
        <Icon name={iconName} iconSize={1.5} />
        <Text>{text}</Text>
      </>
    );
  };

  if (href) {
    return (
      <ToolBarAnchorContainer href={href} target="_blank">
        {renderInner()}
      </ToolBarAnchorContainer>
    );
  }

  return (
    <ToolbarButtonContainer onClick={onClick}>
      {renderInner()}
    </ToolbarButtonContainer>
  );
};

export default ToolbarButton;
