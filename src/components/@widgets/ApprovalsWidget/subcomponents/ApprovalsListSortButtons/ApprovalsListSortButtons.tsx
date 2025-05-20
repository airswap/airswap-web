import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import SortButton from "../../../../SortButton/SortButton";
import { ApprovalSortType } from "../../types";
import { ActionsButton, Container } from "./ApprovalsListSortButtons.styles";

interface ApprovalsListSortButtonsProps {
  isDisabled: boolean;
  activeSortType: ApprovalSortType;
  sortTypeDirection: Record<ApprovalSortType, boolean>;
  onSortButtonClick: (type: ApprovalSortType) => void;
  className?: string;
}

const ApprovalsListSortButtons: FC<ApprovalsListSortButtonsProps> = ({
  isDisabled,
  activeSortType,
  sortTypeDirection,
  onSortButtonClick,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <SortButton
        isDisabled={isDisabled}
        isSortable
        isActive={activeSortType === "token"}
        isDescending={sortTypeDirection.token}
        onClick={() => onSortButtonClick("token")}
      >
        {t("common.token")}
      </SortButton>
      <SortButton
        isDisabled={isDisabled}
        isSortable
        isActive={activeSortType === "balance"}
        isDescending={sortTypeDirection.balance}
        onClick={() => onSortButtonClick("balance")}
      >
        {t("common.balance")}
      </SortButton>
      <SortButton
        isDisabled={isDisabled}
        isSortable
        isActive={activeSortType === "approval"}
        isDescending={sortTypeDirection.approval}
        onClick={() => onSortButtonClick("approval")}
      >
        {t("common.allowance")}
      </SortButton>
      <SortButton
        isDisabled={isDisabled}
        isSortable
        isActive={activeSortType === "contract"}
        isDescending={sortTypeDirection.contract}
        onClick={() => onSortButtonClick("contract")}
      >
        {t("common.contract")}
      </SortButton>
      <ActionsButton isDisabled>{t("orders.actions")}</ActionsButton>
    </Container>
  );
};

export default ApprovalsListSortButtons;
