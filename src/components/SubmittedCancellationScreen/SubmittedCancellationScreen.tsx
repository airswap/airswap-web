import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  SubmittedCancellation,
  SubmittedUnsetRuleTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import useDebounce from "../../hooks/useDebounce";
import {
  OverlayContainer,
  OverlaySubHeading,
  OverlayTitle,
  OverlayTransactionLink,
} from "../../styled-components/Overlay/Overlay";
import { TransactionStatusType } from "../../types/transactionTypes";
import OverlayLoader from "../OverlayLoader/OverlayLoader";

interface SubmittedCancellationScreenProps {
  chainId?: number;
  transaction?: SubmittedCancellation | SubmittedUnsetRuleTransaction;
  className?: string;
}

const SubmittedCancellationScreen: FC<SubmittedCancellationScreenProps> = ({
  chainId,
  transaction,
  className = "",
}) => {
  const { t } = useTranslation();
  const [isAnimatedToCenter, setIsAnimatedToCenter] = useState(false);

  const isSucceeded = transaction?.status === TransactionStatusType.succeeded;

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
        {isSucceeded
          ? t("orders.cancelComplete")
          : t("orders.cancelProcessing")}
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

export default SubmittedCancellationScreen;
