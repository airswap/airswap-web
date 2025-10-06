import { FC, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { InterfaceContext } from "../../contexts/interface/Interface";
import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import useDebounce from "../../hooks/useDebounce";
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
  ReturnToOrderButton,
  TrackTransactionButton,
} from "./OrderSubmittedScreen.styles";

interface OrderSubmittedInfoProps {
  isSendingOrder?: boolean;
  showReturnToOrderButton?: boolean;
  showTrackTransactionButton?: boolean;
  chainId?: number;
  transaction?: SubmittedTransaction;
  onMakeNewOrderButtonClick: () => void;
  onReturnToOrderButtonClick?: () => void;
  className?: string;
}

const OrderSubmittedScreen: FC<OrderSubmittedInfoProps> = ({
  isSendingOrder,
  showReturnToOrderButton,
  showTrackTransactionButton,
  chainId,
  transaction,
  onMakeNewOrderButtonClick,
  onReturnToOrderButtonClick,
  className = "",
}) => {
  const { t } = useTranslation();
  const { transactionsTabIsOpen, setTransactionsTabIsOpen } =
    useContext(InterfaceContext);

  const isSucceeded = transaction?.status === TransactionStatusType.succeeded;
  const isProcessing = transaction?.status === TransactionStatusType.processing;
  const [isClickedTrackTransactionButton, setIsClickedTrackTransactionButton] =
    useState(false);

  const handleTrackTransactionButtonClick = () => {
    setIsClickedTrackTransactionButton(true);
  };

  // Hacky hack to delay click to circomvent the useClickOutsideTransactionsTab hook
  useDebounce(
    () => {
      if (isClickedTrackTransactionButton) {
        setIsClickedTrackTransactionButton(false);
        setTransactionsTabIsOpen(true);
      }
    },
    1,
    [isClickedTrackTransactionButton]
  );

  return (
    <OverlayContainer className={className}>
      <OverlayLoader isSucceeded={isSucceeded} />
      {isSendingOrder && (
        <>
          <OverlayTitle type="h2">{t("orders.orderSent")}</OverlayTitle>
          <OverlaySubHeading>{t("orders.orderSentToMaker")}</OverlaySubHeading>
        </>
      )}
      {isProcessing && (
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

          <ButtonsContainer>
            {showTrackTransactionButton && !transactionsTabIsOpen && (
              <TrackTransactionButton
                intent="neutral"
                onClick={handleTrackTransactionButtonClick}
              >
                {t("orders.track")}
              </TrackTransactionButton>
            )}
          </ButtonsContainer>
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

          {showReturnToOrderButton && (
            <ReturnToOrderButton
              intent="neutral"
              onClick={onReturnToOrderButtonClick}
            >
              {t("orders.returnToOrder")}
            </ReturnToOrderButton>
          )}
        </ButtonsContainer>
      )}
    </OverlayContainer>
  );
};

export default OrderSubmittedScreen;
