import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { AvailableOrdersSortType } from "../../AvailableOrdersWidget";
import SortButton from "../SortButton/SortButton";
import { Container } from "./AvailableOrdersListSortButtons.styles";

interface AvailableOrdersListProps {
  activeSortType: AvailableOrdersSortType;
  sortTypeDirection: Record<AvailableOrdersSortType, boolean>;
  senderTokenSymbol: string;
  signerTokenSymbol: string;
  invertRate: boolean;
  onSortButtonClick: (type: AvailableOrdersSortType) => void;
  onRateButtonClick: () => void;
  className?: string;
}

const AvailableOrdersListSortButtons: FC<AvailableOrdersListProps> = ({
  activeSortType,
  sortTypeDirection,
  senderTokenSymbol,
  signerTokenSymbol,
  invertRate,
  onSortButtonClick,
  onRateButtonClick,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <SortButton
        isSortable
        tokenText={senderTokenSymbol}
        isActive={activeSortType === "senderAmount"}
        isDescending={sortTypeDirection.senderAmount}
        onClick={() => onSortButtonClick("senderAmount")}
      >
        {t("orders.from")}
      </SortButton>
      <SortButton
        isSortable
        tokenText={signerTokenSymbol}
        isActive={activeSortType === "signerAmount"}
        isDescending={sortTypeDirection.signerAmount}
        onClick={() => onSortButtonClick("signerAmount")}
      >
        {t("orders.to")}
      </SortButton>
      <SortButton
        isSortable
        tokenTextIsRate
        tokenText={
          invertRate
            ? `${signerTokenSymbol}/${senderTokenSymbol}`
            : `${senderTokenSymbol}/${signerTokenSymbol}`
        }
        isActive={activeSortType === "rate"}
        isDescending={sortTypeDirection.rate}
        onClick={() => onSortButtonClick("rate")}
        onRateClick={onRateButtonClick}
      >
        {t("orders.rate")}
      </SortButton>
    </Container>
  );
};

export default AvailableOrdersListSortButtons;
