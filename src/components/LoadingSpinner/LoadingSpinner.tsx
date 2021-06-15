import classNames from "classnames";
import { AiOutlineLoading } from "react-icons/ai";

type LoadingSpinnerProps = { className?: string };

const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-center h-full w-full",
        className
      )}
    >
      <AiOutlineLoading className="animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
