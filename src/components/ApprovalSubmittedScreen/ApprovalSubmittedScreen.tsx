import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { SubmittedApprovalTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import useDebounce from "../../hooks/useDebounce";
import {
  OverlayContainer,
  OverlaySubHeading,
  OverlayTitle,
  OverlayTransactionLink,
} from "../../styled-components/Overlay/Overlay";
import { TransactionStatusType } from "../../types/transactionTypes";
import OverlayLoader from "../OverlayLoader/OverlayLoader";

interface ApprovalSubmittedScreenProps {
  chainId?: number;
  transaction?: SubmittedApprovalTransaction;
  className?: string;
}

const ApprovalSubmittedScreen: FC<ApprovalSubmittedScreenProps> = ({
  chainId,
  transaction,
  className = "",
}) => {
  const { t } = useTranslation();
  const [isAnimatedToCenter, setIsAnimatedToCenter] = useState(false);

  const isSucceeded = transaction?.status === TransactionStatusType.succeeded;
  const isRevoke = transaction?.amount === "0";

  const approvalCompleteText = isRevoke
    ? t("orders.revokeComplete")
    : t("orders.approvalComplete");
  const approvalProcessingText = isRevoke
    ? t("orders.revokeProcessing")
    : t("orders.approvalProcessing");

  useDebounce(
    () => {
      if (isSucceeded) {
        setIsAnimatedToCenter(true);
      }
    },
    500,
    [isSucceeded]
  );

  return (
    <OverlayContainer
      className={className}
      style={{
        transform: isAnimatedToCenter ? "translateY(2.5rem)" : "translateY(0)",
      }}
    >
      <OverlayLoader isSucceeded={isSucceeded} />
      <OverlayTitle type="h2">
        {isSucceeded ? approvalCompleteText : approvalProcessingText}
      </OverlayTitle>
      <OverlaySubHeading isHidden={isSucceeded}>
        {transaction?.hash && chainId && (
          <OverlayTransactionLink
            isHidden={isSucceeded}
            chainId={chainId}
            hash={transaction.hash}
          />
        )}
      </OverlaySubHeading>
    </OverlayContainer>
  );
};

export default ApprovalSubmittedScreen;
