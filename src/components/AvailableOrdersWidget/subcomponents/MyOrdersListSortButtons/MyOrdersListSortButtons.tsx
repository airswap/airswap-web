import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { AvailableOrdersSortType } from "../../AvailableOrdersWidget";
import SortButton from "../SortButton/SortButton";
import { Container } from "./MyOrdersListSortButtons.styles";

interface AvailableOrdersListProps {
  activeSortType: AvailableOrdersSortType;
  sortTypeDirection: Record<AvailableOrdersSortType, boolean>;
  onSortButtonClick: (type: AvailableOrdersSortType) => void;
  className?: string;
}

const AvailableOrdersListSortButtons: FC<AvailableOrdersListProps> = ({
  activeSortType,
  sortTypeDirection,
  onSortButtonClick,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <SortButton
        isSortable
        tokenText="ETH"
        isActive={activeSortType === "signerToken"}
        isDescending={sortTypeDirection.signerToken}
        onClick={() => onSortButtonClick("signerToken")}
      >
        {t("orders.from")}
      </SortButton>
      <SortButton
        isSortable
        tokenText="Prints"
        isActive={activeSortType === "senderToken"}
        isDescending={sortTypeDirection.senderToken}
        onClick={() => onSortButtonClick("senderToken")}
      >
        {t("orders.to")}
      </SortButton>
      <SortButton
        isSortable
        tokenTextIsRate
        tokenText="ETH/PRINTS"
        isActive={activeSortType === "rate"}
        isDescending={sortTypeDirection.rate}
        onClick={() => onSortButtonClick("rate")}
      >
        {t("orders.rate")}
      </SortButton>
    </Container>
  );
};

export default AvailableOrdersListSortButtons;
