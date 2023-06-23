import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { SubmittedTransaction } from "../../../../features/transactions/transactionsSlice";
import { InfoSubHeading } from "../../../Typography/Typography";
import {
  Container,
  DoneAllIcon,
  StyledInfoHeading,
  StyledTransactionLink,
} from "./OrderSubmittedInfo.styles";

interface OrderSubmittedInfoProps {
  chainId?: number;
  transaction: SubmittedTransaction;
  className?: string;
}

const OrderSubmittedInfo: FC<OrderSubmittedInfoProps> = ({
  chainId,
  transaction,
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
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
    </Container>
  );
};

export default OrderSubmittedInfo;
