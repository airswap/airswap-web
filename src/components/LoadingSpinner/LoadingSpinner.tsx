import { AiOutlineLoading } from "react-icons/ai";

import classNames from "classnames";

type LoadingSpinnerProps = { className?: string };

const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-center h-full",
        className
      )}
    >
      <AiOutlineLoading className="animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
