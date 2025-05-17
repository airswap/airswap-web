import { FC, useMemo, useState } from "react";

import { useAppSelector } from "../../../app/hooks";
import { transformAllowancesToApprovalEntities } from "../../../entities/ApprovalEntity/ApprovalEntityTransformers";
import { selectAllTokenInfo } from "../../../features/metadata/metadataSlice";
import { FadedScrollContainer } from "../../FadedScrollContainer/FadedScrollContainer";
import { Title } from "../../Typography/Typography";
import {
  Container,
  ApprovalsGrid,
  StyledScrollContainer,
} from "./ApprovalsWidget.styles";
import { ApprovalsList } from "./subcomponents/ApprovalsList/ApprovalsList";
import ApprovalsListSortButtons from "./subcomponents/ApprovalsListSortButtons/ApprovalsListSortButtons";
import { ApprovalSortType } from "./types";

export const ApprovalsWidget: FC = () => {
  const allowances = useAppSelector((state) => state.allowances);
  const balances = useAppSelector((state) => state.balances);
  const tokens = useAppSelector(selectAllTokenInfo);

  const approvalEntities = useMemo(
    () => transformAllowancesToApprovalEntities(allowances, balances, tokens),
    [allowances, balances, tokens]
  );

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
      <Title type="h2" as="h1">
        Approvals
      </Title>
      <StyledScrollContainer resizeDependencies={[approvalEntities]}>
        <ApprovalsGrid>
          <ApprovalsListSortButtons
            activeSortType={activeSortType}
            hasOverflow={false}
            sortTypeDirection={sortTypeDirection}
            onSortButtonClick={handleSortButtonClick}
          />
          <ApprovalsList approvals={approvalEntities} />
        </ApprovalsGrid>
      </StyledScrollContainer>
    </Container>
  );
};
