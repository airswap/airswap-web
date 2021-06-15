import classNames from "classnames";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

type ButtonIntent = "neutral" | "primary" | "positive" | "destructive";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  intent?: ButtonIntent;
  disabled?: boolean;
  loading?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const colorClasses: Record<ButtonIntent, string> = {
  neutral: "bg-black text-white dark:bg-white dark:text-black",
  primary: "bg-primary text-white",
  positive: "bg-green-700 text-white",
  destructive: "bg-red-700 text-white",
};

const Button = ({
  children,
  className = "",
  intent = "neutral",
  disabled = false,
  loading = false,
  onClick,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        "px-2 py-1 rounded-sm",
        colorClasses[intent],
        className,
        {
          "opacity-50": disabled,
          "pointer-events-none": disabled || loading,
          "cursor-wait": loading,
        }
      )}
      onClick={(e) => {
        console.log("activate");
        !loading && onClick && onClick(e);
      }}
      {...rest}
    >
      {loading ? (
        // Note we keep children in here so the button doesn't change shape when
        // it's loading.
        <div className="flex flex-row items-center justify-center">
          <div className="invisible">{children}</div>
          <LoadingSpinner className="absolute" />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
