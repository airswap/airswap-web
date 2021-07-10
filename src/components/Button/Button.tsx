import React from 'react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { StyledButton, StyledText } from './Button.styles';

type ButtonIntent = "neutral" | "primary" | "positive" | "destructive";
type ButtonJustifyContent = "center" | "flex-start" | 'flex-end';

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

// const colorClasses: Record<ButtonIntent, string> = {
//   neutral: "bg-gray-200 text-black dark:bg-gray-700 dark:text-white",
//   primary: "bg-primary text-white",
//   positive: "bg-green-700 text-white",
//   destructive: "bg-red-700 text-white",
// };

export const Button = ({
  children,
  className = "",
  intent = "neutral",
  justifyContent = "center",
  disabled = false,
  loading = false,
  onClick,
  ...rest
}: ButtonProps) => {
  return (
    <StyledButton
      loading={loading}
      justifyContent={justifyContent}
      onClick={(e) => {
        !loading && onClick && onClick(e);
      }}
      {...rest}
    >
      <StyledText loading={loading}>
        {children}
      </StyledText>
      {loading && <LoadingSpinner />}
    </StyledButton>
  );
};

export default Button;
