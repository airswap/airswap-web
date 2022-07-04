import React, { FC } from "react";

import useAppRouteParams from "../../../../hooks/useAppRouteParams";
import { AppRoutes } from "../../../../routes";
import {
  StyledIcon,
  Text,
  ToolBarAnchorContainer,
  ToolbarButtonContainer,
  ToolBarLinkContainer,
} from "./ToolbarButton.styles";

type ToolbarButtonProps = {
  text: string;
  iconName: string;
  iconSize?: number;
  href?: string;
  link?: AppRoutes;
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => void;
};

const ToolbarButton: FC<ToolbarButtonProps> = ({
  text,
  iconName,
  iconSize = 1.5,
  href,
  link,
  onClick,
}) => {
  const appRouteParams = useAppRouteParams();

  const renderInner = () => {
    return (
      <>
        <StyledIcon name={iconName} iconSize={iconSize} />
        <Text>{text}</Text>
      </>
    );
  };

  if (link) {
    return (
      <ToolBarLinkContainer
        onClick={onClick}
        to={`${appRouteParams.justifiedBaseUrl}/${link}`}
      >
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
