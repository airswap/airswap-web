import { FC, ReactNode } from "react";

import Icon from "../Icon/Icon";
import { CloseButton, Container, StyledIcon, Text } from "./Notice.styles";

interface NoticeProps {
  className?: string;
  text: ReactNode;
  onCloseButtonClick?: () => void;
}

export const Notice: FC<NoticeProps> = ({
  className,
  text,
  onCloseButtonClick,
}) => {
  return (
    <Container className={className}>
      <StyledIcon name="information-circle" iconSize={1.5} />
      <Text>{text}</Text>
      {onCloseButtonClick && (
        <CloseButton onClick={onCloseButtonClick}>
          <Icon name="close" iconSize={1} />
        </CloseButton>
      )}
    </Container>
  );
};
