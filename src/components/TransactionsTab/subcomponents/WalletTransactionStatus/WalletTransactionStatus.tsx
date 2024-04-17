import { TransactionStatusType } from "../../../../types/transactionTypes";
import {
  FailedIcon,
  IconContainer,
  ProcessingIcon,
  SucceedIcon,
} from "./WalletTransactionStatus.styles";

type WalletTransactionStatusProps = {
  status:
    | TransactionStatusType.succeeded
    | TransactionStatusType.processing
    | TransactionStatusType.reverted;
  className?: string;
};

const WalletTransactionStatus = ({
  status,
  className = "",
}: WalletTransactionStatusProps) => {
  return (
    <IconContainer>
      {status === TransactionStatusType.succeeded ? (
        <SucceedIcon
          className={className}
          iconSize={1.875}
          name="transaction-completed"
        />
      ) : status === TransactionStatusType.processing ? (
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
