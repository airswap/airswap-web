import { FC } from "react";
import { useTranslation } from "react-i18next";

import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { TransactionStatusType } from "../../types/transactionTypes";
import { InfoSubHeading } from "../Typography/Typography";
import {
  ButtonsContainer,
  Container,
  InfoContainer,
  MakeNewOrderButton,
  StyledIcon,
  StyledInfoHeading,
  StyledInfoSubHeading,
  StyledTransactionLink,
  TrackTransactionButton,
} from "./OrderSubmittedScreen.styles";

interface OrderSubmittedInfoProps {
  showTrackTransactionButton?: boolean;
  chainId?: number;
  transaction: SubmittedTransaction;
  onMakeNewOrderButtonClick: () => void;
  onTrackTransactionButtonClick?: () => void;
  className?: string;
}

const OrderSubmittedScreen: FC<OrderSubmittedInfoProps> = ({
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
        {transaction.status === TransactionStatusType.processing && (
          <>
            <StyledInfoHeading>{t("orders.submitted")}</StyledInfoHeading>
            <StyledInfoSubHeading>
              {t("orders.trackTransaction")}
            </StyledInfoSubHeading>
          </>
        )}
        {transaction.status === TransactionStatusType.succeeded && (
          <>
            <StyledInfoHeading>
              {t("orders.transactionCompleted")}
            </StyledInfoHeading>
          </>
        )}
        {transaction.hash && chainId && (
          <StyledTransactionLink chainId={chainId} hash={transaction.hash} />
        )}
      </InfoContainer>
      <ButtonsContainer>
        <MakeNewOrderButton
          intent="primary"
          onClick={onMakeNewOrderButtonClick}
        >
          {t("orders.makeNewOrder")}
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
