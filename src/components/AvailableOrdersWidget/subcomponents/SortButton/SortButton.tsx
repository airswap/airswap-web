import React, { FC, PropsWithChildren } from "react";

import IconSwap from "../../../Icon/icons/IconSwapHorizontal";
import {
  Arrow,
  Button,
  Container,
  StyledIconButton,
  TokenText,
} from "./SortButton.styles";

interface SortButtonProps {
  tokenText: string;
  tokenTextIsRate?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  isDescending?: boolean;
  isSortable?: boolean;
  onClick?: () => void;
  className?: string;
}

const SortButton: FC<PropsWithChildren<SortButtonProps>> = ({
  tokenText,
  tokenTextIsRate,
  isActive,
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
        isActive={!!isActive}
        isDescending={!!isDescending}
        hasText={!!children}
        onClick={onClick}
      >
        {children}
        {isSortable && <Arrow />}
      </Button>
      <TokenText>
        {tokenText}
        {tokenTextIsRate && (
          <StyledIconButton icon="swap-horizontal" iconSize={0.75} />
        )}
      </TokenText>
    </Container>
  );
};

export default SortButton;
