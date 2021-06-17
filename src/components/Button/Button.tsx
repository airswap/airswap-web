import classNames from "classnames";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

type ButtonIntent = "neutral" | "primary" | "positive" | "destructive";

export type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Intent affects the appearance of the button
   */
  intent?: ButtonIntent;
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

export const Button = ({
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
        !loading && onClick && onClick(e);
      }}
      {...rest}
    >
      {/* // Note we keep children in here so the button doesn't change shape when
        // it's loading. */}
      <div className="flex flex-row items-center justify-center">
        <div
          key="children"
          className={classNames("transition-opacity", {
            "opacity-20": loading,
            "opacity-100": !loading,
          })}
        >
          {children}
        </div>
        {loading && <LoadingSpinner className="absolute" />}
      </div>
    </button>
  );
};

export default Button;
