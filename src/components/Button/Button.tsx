import React from "react";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { StyledButton, Text } from "./Button.styles";

export type ButtonIntent = "neutral" | "primary" | "positive" | "destructive";
export type ButtonJustifyContent = "center" | "flex-start" | "flex-end";

export type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Intent affects the appearance of the button
   */
  intent?: ButtonIntent;
  /**
   * Intent affects the appearance of the button
   */
  justifyContent?: ButtonJustifyContent;
  /**
   * Whether or not the button should be disabled. Clicking a disabled button
   * has no effect.
   */
  disabled?: boolean;
  /**
   * Whether or not to show a loading spinner within the button. This also
   * prevents further clicks on the button
   */
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      intent = "neutral",
      justifyContent = "center",
      disabled = false,
      loading = false,
      onClick,
      ...rest
    },
    ref
  ) => {
    return (
      <StyledButton
        className={className}
        $loading={loading}
        intent={intent}
        disabled={disabled || loading}
        justifyContent={justifyContent}
        onClick={(e) => {
          !loading && onClick && onClick(e);
        }}
        ref={ref}
        {...rest}
      >
        <Text>{children}</Text>
        {loading && <LoadingSpinner />}
      </StyledButton>
    );
  }
);

export default Button;
