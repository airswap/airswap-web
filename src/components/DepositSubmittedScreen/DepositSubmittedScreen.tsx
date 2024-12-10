import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { SubmittedDepositTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import useDebounce from "../../hooks/useDebounce";
import {
  OverlayContainer,
  OverlaySubHeading,
  OverlayTitle,
  OverlayTransactionLink,
} from "../../styled-components/Overlay/Overlay";
import { TransactionStatusType } from "../../types/transactionTypes";
import OverlayLoader from "../OverlayLoader/OverlayLoader";

interface DepositSubmittedScreenProps {
  chainId?: number;
  transaction?: SubmittedDepositTransaction;
  className?: string;
}

const DepositSubmittedScreen: FC<DepositSubmittedScreenProps> = ({
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
        transform: isAnimatedToCenter ? "translateY(5rem)" : "translateY(0)",
      }}
    >
      <OverlayLoader isSucceeded={isSucceeded} />
      <OverlayTitle type="h2">
        {isSucceeded
          ? t("orders.depositComplete")
          : t("orders.depositProcessing")}
      </OverlayTitle>
      <OverlaySubHeading isHidden={isSucceeded}>
        {t("orders.trackTransaction")}
      </OverlaySubHeading>
      {transaction?.hash && chainId && (
        <OverlayTransactionLink
          isHidden={isSucceeded}
          chainId={chainId}
          hash={transaction.hash}
        />
      )}
    </OverlayContainer>
  );
};

export default DepositSubmittedScreen;
