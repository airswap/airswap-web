import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { invert } from "lodash";

import { AvailableOrdersSortType } from "../../AvailableOrdersWidget";
import SortButton from "../SortButton/SortButton";
import { Container } from "./MyOrdersListSortButtons.styles";

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
        isActive={activeSortType === "signerToken"}
        isDescending={sortTypeDirection.signerToken}
        onClick={() => onSortButtonClick("signerToken")}
      >
        {t("orders.from")}
      </SortButton>
      <SortButton
        isSortable
        tokenText={signerTokenSymbol}
        isActive={activeSortType === "senderToken"}
        isDescending={sortTypeDirection.senderToken}
        onClick={() => onSortButtonClick("senderToken")}
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
