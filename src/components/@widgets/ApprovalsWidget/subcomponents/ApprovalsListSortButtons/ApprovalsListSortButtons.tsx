import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import SortButton from "../../../../SortButton/SortButton";
import { ApprovalSortType } from "../../types";
import { ActionsButton, Container } from "./ApprovalsListSortButtons.styles";

interface ApprovalsListSortButtonsProps {
  activeSortType: ApprovalSortType;
  hasOverflow: boolean;
  sortTypeDirection: Record<ApprovalSortType, boolean>;
  onSortButtonClick: (type: ApprovalSortType) => void;
  className?: string;
}

const ApprovalsListSortButtons: FC<ApprovalsListSortButtonsProps> = ({
  activeSortType,
  hasOverflow,
  sortTypeDirection,
  onSortButtonClick,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Container className={className} hasOverflow={hasOverflow}>
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
      <ActionsButton
        isSortable
        isActive={activeSortType === "actions"}
        isDescending={sortTypeDirection.actions}
        onClick={() => onSortButtonClick("actions")}
      >
        Actions
      </ActionsButton>
    </Container>
  );
};

export default ApprovalsListSortButtons;
