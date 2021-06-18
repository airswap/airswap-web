import classNames from "classnames";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

type ButtonIntent = "neutral" | "primary" | "positive" | "destructive";
type ButtonVariant = "centered" | "left-justified";

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
  variant?: ButtonVariant | ButtonVariant[];
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
  neutral: "bg-gray-200 text-black dark:bg-gray-700 dark:text-white",
  primary: "bg-primary text-white",
  positive: "bg-green-700 text-white",
  destructive: "bg-red-700 text-white",
};

const variantClasses: Record<ButtonVariant, string> = {
  centered: "justify-center",
  "left-justified": "justif",
};

export const Button = ({
  children,
  className = "",
  intent = "neutral",
  variant = "centered",
  disabled = false,
  loading = false,
  onClick,
  ...rest
}: ButtonProps) => {
  const variants = Array.isArray(variant) ? variant : [variant];
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
      <div
        className={classNames(
          "flex flex-row items-center",
          variants.map((v) => variantClasses[v])
        )}
      >
        <div
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
