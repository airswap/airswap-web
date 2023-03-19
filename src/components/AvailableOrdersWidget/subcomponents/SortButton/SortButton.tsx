import React, { FC, PropsWithChildren } from "react";

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
  onRateClick?: () => void;
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
  onRateClick,
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
        <span className="ellipsis">{tokenText}</span>
        {tokenTextIsRate && (
          <StyledIconButton
            icon="swap-horizontal"
            iconSize={0.75}
            onClick={onRateClick}
          />
        )}
      </TokenText>
    </Container>
  );
};

export default SortButton;
