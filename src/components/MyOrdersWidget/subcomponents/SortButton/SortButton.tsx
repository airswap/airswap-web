import React, { FC, PropsWithChildren } from "react";

import { Arrow, Button, Container } from "./SortButton.styles";

interface SortButtonProps {
  isActive?: boolean;
  isDisabled?: boolean;
  isDescending?: boolean;
  isSortable?: boolean;
  onClick?: () => void;
  className?: string;
}

const SortButton: FC<PropsWithChildren<SortButtonProps>> = ({
  isDisabled,
  isDescending,
  isSortable,
  onClick,
  children,
  className,
}) => {
  return (
    <Container className={className}>
      <Button
        as={isDisabled ? "div" : "button"}
        isDescending={!!isDescending}
        hasText={!!children}
        onClick={onClick}
      >
        {children}
        {isSortable && <Arrow />}
      </Button>
    </Container>
  );
};

export default SortButton;
