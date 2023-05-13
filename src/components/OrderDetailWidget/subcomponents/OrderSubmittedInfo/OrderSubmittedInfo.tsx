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
  transactionStatus: SubmittedTransaction["status"];
  className?: string;
}

const OrderSubmittedInfo: FC<OrderSubmittedInfoProps> = ({
  transactionStatus,
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <DoneAllIcon />
      {transactionStatus === "processing" && (
        <>
          <StyledInfoHeading>{t("orders.submitted")}</StyledInfoHeading>
          <InfoSubHeading>{t("orders.trackTransaction")}</InfoSubHeading>
        </>
      )}
      {transactionStatus === "succeeded" && (
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
