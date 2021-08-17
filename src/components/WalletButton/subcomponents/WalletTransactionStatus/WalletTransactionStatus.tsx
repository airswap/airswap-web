import Icon from "../../../Icon/Icon";

type WalletTransactionStatusProps = {
  status: "succeeded" | "processing" | "reverted";
};

const WalletTransactionStatus = ({ status }: WalletTransactionStatusProps) => {
  return (
    <>
      {status === "succeeded" ? (
        <Icon iconSize={1} name="transaction-completed" />
      ) : status === "processing" ? (
        <Icon iconSize={1} name="transaction-pending" />
      ) : (
        <Icon iconSize={1} name="transaction-failed" />
      )}
    </>
  );
};

export default WalletTransactionStatus;
