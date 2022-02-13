import React, { FC } from "react";

import { AppRoutes } from "../../../../routes";
import Icon from "../../../Icon/Icon";
import {
  Text,
  ToolBarAnchorContainer,
  ToolbarButtonContainer,
  ToolBarLinkContainer,
} from "./ToolbarButton.styles";

type ToolbarButtonProps = {
  text: string;
  iconName: string;
  href?: string;
  link?: AppRoutes;
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => void;
};

const ToolbarButton: FC<ToolbarButtonProps> = ({
  text,
  iconName,
  href,
  link,
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

  if (link) {
    return (
      <ToolBarLinkContainer onClick={onClick} to={`/${link}`}>
        {renderInner()}
      </ToolBarLinkContainer>
    );
  }

  if (href) {
    return (
      <ToolBarAnchorContainer onClick={onClick} href={href} target="_blank">
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
