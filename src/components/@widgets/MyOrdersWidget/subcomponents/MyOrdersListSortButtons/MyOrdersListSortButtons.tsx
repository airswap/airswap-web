import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { OrdersSortType } from "../../../../../types/ordersSortType";
import SortButton from "../../../../SortButton/SortButton";
import {
  ActionsButton,
  Container,
  PairButtonWrapper,
} from "./MyOrdersListSortButtons.styles";

interface MyOrdersListProps {
  activeSortType: OrdersSortType;
  hasFilledColumn?: boolean;
  hasForColumn?: boolean;
  sortTypeDirection: Record<OrdersSortType, boolean>;
  onSortButtonClick: (type: OrdersSortType) => void;
  className?: string;
}

const MyOrdersListSortButtons: FC<MyOrdersListProps> = ({
  activeSortType,
  hasFilledColumn,
  hasForColumn,
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
      <PairButtonWrapper>
        <SortButton isDisabled>{t("common.pair")}</SortButton>
      </PairButtonWrapper>
      {hasFilledColumn && (
        <SortButton
          isSortable
          isActive={activeSortType === "filled"}
          isDescending={sortTypeDirection.filled}
          onClick={() => onSortButtonClick("filled")}
        >
          {t("common.filled")}
        </SortButton>
      )}
      {hasForColumn && (
        <SortButton
          isSortable
          isActive={activeSortType === "for"}
          isDescending={sortTypeDirection.for}
          onClick={() => onSortButtonClick("for")}
        >
          {t("common.for")}
        </SortButton>
      )}
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
      <ActionsButton isDisabled>{t("orders.actions")}</ActionsButton>
    </Container>
  );
};

export default MyOrdersListSortButtons;
