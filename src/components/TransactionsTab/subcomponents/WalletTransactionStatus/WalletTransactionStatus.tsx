import {
  FailedIcon,
  IconContainer,
  ProcessingIcon,
  SucceedIcon,
} from "./WalletTransactionStatus.styles";

type WalletTransactionStatusProps = {
  status: "succeeded" | "processing" | "reverted";
  className?: string;
};

const WalletTransactionStatus = ({
  status,
  className = "",
}: WalletTransactionStatusProps) => {
  return (
    <IconContainer>
      {status === "succeeded" ? (
        <SucceedIcon
          className={className}
          iconSize={1.875}
          name="transaction-completed"
        />
      ) : status === "processing" ? (
        <ProcessingIcon
          className={className}
          iconSize={1.5}
          name="transaction-pending"
        />
      ) : (
        <FailedIcon
          className={className}
          iconSize={1.5}
          name="transaction-failed"
        />
      )}
    </IconContainer>
  );
};

export default WalletTransactionStatus;
