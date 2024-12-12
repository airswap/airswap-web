import { FC } from "react";
import { useTranslation } from "react-i18next";

import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  OverlayContainer,
  OverlaySubHeading,
  OverlayTitle,
  OverlayTransactionLink,
} from "../../styled-components/Overlay/Overlay";
import { TransactionStatusType } from "../../types/transactionTypes";
import OverlayLoader from "../OverlayLoader/OverlayLoader";
import {
  ButtonsContainer,
  MakeNewOrderButton,
  TrackTransactionButton,
} from "./OrderSubmittedScreen.styles";

interface OrderSubmittedInfoProps {
  isSendingOrder?: boolean;
  showTrackTransactionButton?: boolean;
  chainId?: number;
  transaction?: SubmittedTransaction;
  onMakeNewOrderButtonClick: () => void;
  onTrackTransactionButtonClick?: () => void;
  className?: string;
}

const OrderSubmittedScreen: FC<OrderSubmittedInfoProps> = ({
  isSendingOrder,
  showTrackTransactionButton,
  chainId,
  transaction,
  onMakeNewOrderButtonClick,
  onTrackTransactionButtonClick,
  className = "",
}) => {
  const { t } = useTranslation();

  const isSucceeded = transaction?.status === TransactionStatusType.succeeded;

  return (
    <OverlayContainer className={className}>
      <OverlayLoader isSucceeded={isSucceeded} />
      {isSendingOrder && (
        <>
          <OverlayTitle type="h2">{t("orders.orderSent")}</OverlayTitle>
          <OverlaySubHeading>{t("orders.orderSentToMaker")}</OverlaySubHeading>
        </>
      )}
      {transaction?.status === TransactionStatusType.processing && (
        <>
          <OverlayTitle type="h2">{t("orders.orderSubmitted")}</OverlayTitle>
          <OverlaySubHeading>
            {(transaction?.hash && chainId && (
              <OverlayTransactionLink
                chainId={chainId}
                hash={transaction.hash}
              />
            )) ||
              t("orders.orderSubmittedByMaker")}
          </OverlaySubHeading>
        </>
      )}
      {isSucceeded && (
        <OverlayTitle type="h2">
          {t("orders.transactionCompleted")}
        </OverlayTitle>
      )}

      {isSucceeded && (
        <ButtonsContainer>
          <MakeNewOrderButton
            intent="primary"
            onClick={onMakeNewOrderButtonClick}
          >
            {t("orders.makeNewSwap")}
          </MakeNewOrderButton>

          {showTrackTransactionButton && (
            <TrackTransactionButton
              intent="neutral"
              onClick={onTrackTransactionButtonClick}
            >
              {t("orders.track")}
            </TrackTransactionButton>
          )}
        </ButtonsContainer>
      )}
    </OverlayContainer>
  );
};

export default OrderSubmittedScreen;
