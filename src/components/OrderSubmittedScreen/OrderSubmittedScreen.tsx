import { FC } from "react";
import { useTranslation } from "react-i18next";

import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  OverlaySubHeading,
  OverlayTitle,
} from "../../styled-components/Overlay/Overlay";
import { TransactionStatusType } from "../../types/transactionTypes";
import {
  ButtonsContainer,
  Container,
  InfoContainer,
  MakeNewOrderButton,
  StyledIcon,
  StyledOverlayTitle,
  StyledTransactionLink,
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

  return (
    <Container className={className}>
      <InfoContainer>
        <StyledIcon name="check-circle" />
        {isSendingOrder && (
          <>
            <StyledOverlayTitle type="h2">
              {t("orders.transactionSent")}
            </StyledOverlayTitle>
            <OverlaySubHeading>
              {t("orders.transactionSentToMaker")}
            </OverlaySubHeading>
          </>
        )}
        {transaction?.status === TransactionStatusType.processing && (
          <>
            <StyledOverlayTitle type="h2">
              {t("orders.transactionSubmitted")}
            </StyledOverlayTitle>
            <OverlaySubHeading>
              {t("orders.trackTransaction")}
            </OverlaySubHeading>
          </>
        )}
        {transaction?.status === TransactionStatusType.succeeded && (
          <OverlayTitle type="h2">
            {t("orders.transactionCompleted")}
          </OverlayTitle>
        )}
        {transaction?.hash && chainId && (
          <StyledTransactionLink chainId={chainId} hash={transaction.hash} />
        )}
      </InfoContainer>
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
    </Container>
  );
};

export default OrderSubmittedScreen;
