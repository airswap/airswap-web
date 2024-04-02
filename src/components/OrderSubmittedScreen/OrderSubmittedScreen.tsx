import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { InfoSubHeading } from "../Typography/Typography";
import {
  Container,
  DoneAllIcon,
  InfoContainer,
  MakeNewOrderButton,
  StyledInfoHeading,
  StyledTransactionLink,
} from "./OrderSubmittedScreen.styles";

interface OrderSubmittedInfoProps {
  chainId?: number;
  transaction: SubmittedTransaction;
  onMakeNewOrderButtonClick: () => void;
  className?: string;
}

const OrderSubmittedScreen: FC<OrderSubmittedInfoProps> = ({
  chainId,
  transaction,
  onMakeNewOrderButtonClick,
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <InfoContainer>
        <DoneAllIcon />
        {transaction.status === "processing" && (
          <>
            <StyledInfoHeading>{t("orders.submitted")}</StyledInfoHeading>
            <InfoSubHeading>{t("orders.trackTransaction")}</InfoSubHeading>
          </>
        )}
        {transaction.status === "succeeded" && (
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
      <MakeNewOrderButton intent="primary" onClick={onMakeNewOrderButtonClick}>
        {t("orders.makeNewOrder")}
      </MakeNewOrderButton>
    </Container>
  );
};

export default OrderSubmittedScreen;
