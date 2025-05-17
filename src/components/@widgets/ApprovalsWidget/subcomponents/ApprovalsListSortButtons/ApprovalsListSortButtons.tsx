import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import SortButton from "../../../../SortButton/SortButton";
import { ApprovalSortType } from "../../types";
import { ActionsButton, Container } from "./ApprovalsListSortButtons.styles";

interface ApprovalsListSortButtonsProps {
  activeSortType: ApprovalSortType;
  sortTypeDirection: Record<ApprovalSortType, boolean>;
  onSortButtonClick: (type: ApprovalSortType) => void;
  className?: string;
}

const ApprovalsListSortButtons: FC<ApprovalsListSortButtonsProps> = ({
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
        isActive={activeSortType === "token"}
        isDescending={sortTypeDirection.token}
        onClick={() => onSortButtonClick("token")}
      >
        Token
      </SortButton>
      <SortButton
        isSortable
        isActive={activeSortType === "balance"}
        isDescending={sortTypeDirection.balance}
        onClick={() => onSortButtonClick("balance")}
      >
        Balance
      </SortButton>
      <SortButton
        isSortable
        isActive={activeSortType === "approval"}
        isDescending={sortTypeDirection.approval}
        onClick={() => onSortButtonClick("approval")}
      >
        Allowance
      </SortButton>
      <SortButton
        isSortable
        isActive={activeSortType === "contract"}
        isDescending={sortTypeDirection.contract}
        onClick={() => onSortButtonClick("contract")}
      >
        Contract
      </SortButton>
      <ActionsButton isDisabled>Actions</ActionsButton>
    </Container>
  );
};

export default ApprovalsListSortButtons;
