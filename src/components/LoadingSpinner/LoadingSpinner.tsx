import { LoadingSpinnerContainer, SpinningIcon } from "./LoadingSpinner.styles";
import { FC } from "react";

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <LoadingSpinnerContainer className={className}>
      <SpinningIcon />
    </LoadingSpinnerContainer>
  );
};

export default LoadingSpinner;
