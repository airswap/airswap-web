import { FC } from "react";

import { LoadingSpinnerContainer, SpinningIcon } from "./LoadingSpinner.styles";

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
