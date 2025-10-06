import { FC } from "react";
import { useTranslation } from "react-i18next";

import { OrderStatus } from "../../../../../types/orderStatus";
import { OrderType } from "../../../../../types/orderTypes";
import OrderRecipientInfo from "../OrderRecipientInfo/OrderRecipientInfo";
import {
  Container,
  FilledAmount,
  Recipient,
  StyledOrderStatusInfo,
  Title,
} from "./FilledAndStatus.styles";

interface FilledAndStatusProps {
  isLoading?: boolean;
  isOwner?: boolean;
  expiry: Date;
  filledAmount?: string;
  filledPercentage: number;
  link?: string;
  orderType: OrderType;
  status: OrderStatus;
  tokenSymbol?: string;
  className?: string;
}

export const FilledAndStatus: FC<FilledAndStatusProps> = ({
  isLoading = false,
  isOwner,
  expiry,
  filledAmount,
  filledPercentage,
  link,
  status,
  tokenSymbol = "?",
  className,
}) => {
  const { t } = useTranslation();
  const roundedFilledPercentage = Math.round(filledPercentage * 100) / 100;

  return (
    <Container className={className}>
      {isOwner ? (
        <FilledAmount>
          <Title>Filled:</Title>
          {`${filledAmount} ${tokenSymbol} (${roundedFilledPercentage}%)`}
        </FilledAmount>
      ) : (
        <Recipient>
          {`${t("common.for")}:`} {t("orders.anyone")}
        </Recipient>
      )}

      <StyledOrderStatusInfo
        isLoading={isLoading}
        expiry={expiry}
        link={link}
        status={status}
      />
    </Container>
  );
};
