import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { SubmittedTransaction } from "../../../../features/transactions/transactionsSlice";
import { InfoSubHeading } from "../../../Typography/Typography";
import {
  Container,
  DoneAllIcon,
  StyledInfoHeading,
} from "./OrderSubmittedInfo.styles";

interface OrderSubmittedInfoProps {
  transaction: SubmittedTransaction;
  className?: string;
}

const OrderSubmittedInfo: FC<OrderSubmittedInfoProps> = ({
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
    </Container>
  );
};

export default OrderSubmittedInfo;
