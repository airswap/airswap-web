import classNames from "classnames";

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={classNames("p-4 flex bg-white dark:bg-black", className)}>
      {children}
    </div>
  );
};

export default Card;
