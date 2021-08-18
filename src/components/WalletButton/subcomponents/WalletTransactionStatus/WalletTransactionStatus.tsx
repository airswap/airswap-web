import Icon from "../../../Icon/Icon";

type WalletTransactionStatusProps = {
  status: "succeeded" | "processing" | "reverted";
  className?: string;
};

const WalletTransactionStatus = ({
  status,
  className = "",
}: WalletTransactionStatusProps) => {
  return (
    <>
      {status === "succeeded" ? (
        <Icon
          className={className}
          iconSize={1.875}
          name="transaction-completed"
        />
      ) : status === "processing" ? (
        <Icon
          className={className}
          iconSize={1.875}
          name="transaction-pending"
        />
      ) : (
        <Icon
          className={className}
          iconSize={1.875}
          name="transaction-failed"
        />
      )}
    </>
  );
};

export default WalletTransactionStatus;
