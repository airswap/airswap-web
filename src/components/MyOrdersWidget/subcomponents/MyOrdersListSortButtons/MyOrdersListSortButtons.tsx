import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { OrdersSortType } from "../../../../features/myOrders/myOrdersSlice";
import SortButton from "../SortButton/SortButton";
import { Container } from "./MyOrdersListSortButtons.styles";

interface MyOrdersListProps {
  activeSortType: OrdersSortType;
  sortTypeDirection: Record<OrdersSortType, boolean>;
  onSortButtonClick: (type: OrdersSortType) => void;
  className?: string;
}

const MyOrdersListSortButtons: FC<MyOrdersListProps> = ({
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
        isActive={activeSortType === "active"}
        isDescending={sortTypeDirection.active}
        onClick={() => onSortButtonClick("active")}
      />
      <SortButton
        isSortable
        isActive={activeSortType === "signerToken"}
        isDescending={sortTypeDirection.signerToken}
        onClick={() => onSortButtonClick("signerToken")}
      >
        {t("orders.from")}
      </SortButton>
      <SortButton
        isSortable
        isActive={activeSortType === "senderToken"}
        isDescending={sortTypeDirection.senderToken}
        onClick={() => onSortButtonClick("senderToken")}
      >
        {t("orders.to")}
      </SortButton>
      <SortButton
        isSortable
        isActive={activeSortType === "expiry"}
        isDescending={sortTypeDirection.expiry}
        onClick={() => onSortButtonClick("expiry")}
      >
        {t("common.status")}
      </SortButton>
    </Container>
  );
};

export default MyOrdersListSortButtons;
