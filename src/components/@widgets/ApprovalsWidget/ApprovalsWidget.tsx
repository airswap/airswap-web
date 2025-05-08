import { FC, useEffect, useState } from "react";

import { Container, ApprovalsGrid } from "./ApprovalsWidget.styles";
import ApprovalsListSortButtons from "./subcomponents/ApprovalsListSortButtons/ApprovalsListSortButtons";
import { ApprovalSortType } from "./types/ApprovalSortType";

export const ApprovalsWidget: FC = () => {
  const [activeSortType, setActiveSortType] =
    useState<ApprovalSortType>("token");

  const [sortTypeDirection, setSortTypeDirection] = useState<
    Record<ApprovalSortType, boolean>
  >({
    token: true,
    balance: true,
    approval: true,
    contract: true,
    actions: true,
  });

  const handleSortButtonClick = (sortType: ApprovalSortType) => {
    const currentSorting = sortTypeDirection[sortType];

    setActiveSortType(sortType);
    setSortTypeDirection({
      ...sortTypeDirection,
      [sortType]: !currentSorting,
    });
  };

  return (
    <Container>
      <ApprovalsGrid>
        <ApprovalsListSortButtons
          activeSortType={activeSortType}
          hasOverflow={false}
          sortTypeDirection={sortTypeDirection}
          onSortButtonClick={handleSortButtonClick}
        />
      </ApprovalsGrid>
    </Container>
  );
};
