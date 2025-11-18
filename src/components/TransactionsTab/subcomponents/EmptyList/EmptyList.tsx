import { FC, PropsWithChildren } from "react";

import Icon from "../../../Icon/Icon";
import { Container, IconContainer } from "./EmptyList.styles";

type EmptyListProps = {
  className?: string;
};

export const EmptyList: FC<PropsWithChildren<EmptyListProps>> = ({
  className,
  children,
}) => {
  return (
    <Container className={className}>
      <IconContainer>
        <Icon name="transaction" />
      </IconContainer>
      {children}
    </Container>
  );
};
