import { FC, useMemo, useState } from "react";

import { ADDRESS_ZERO } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import { formatUnits } from "ethers/lib/utils";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  getTokenDecimals,
  isCollectionTokenInfo,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { ApprovalEntity } from "../../../entities/ApprovalEntity/ApprovalEntity";
import { transformAllowancesToApprovalEntities } from "../../../entities/ApprovalEntity/ApprovalEntityTransformers";
import { selectAllTokenInfo } from "../../../features/metadata/metadataSlice";
import { approve } from "../../../features/orders/ordersActions";
import { selectOrdersStatus } from "../../../features/orders/ordersSlice";
import useApprovalPending from "../../../hooks/useApprovalPending";
import ApprovalSubmittedScreen from "../../ApprovalSubmittedScreen/ApprovalSubmittedScreen";
import TransactionOverlay from "../../TransactionOverlay/TransactionOverlay";
import { Title } from "../../Typography/Typography";
import WalletSignScreen from "../../WalletSignScreen/WalletSignScreen";
import {
  Container,
  ApprovalsGrid,
  StyledScrollContainer,
} from "./ApprovalsWidget.styles";
import { sortApprovalEntities } from "./helpers";
import { ApprovalsList } from "./subcomponents/ApprovalsList/ApprovalsList";
import ApprovalsListSortButtons from "./subcomponents/ApprovalsListSortButtons/ApprovalsListSortButtons";
import { ApprovalSortType } from "./types";

export const ApprovalsWidget: FC = () => {
  const allowances = useAppSelector((state) => state.allowances);
  const balances = useAppSelector((state) => state.balances);
  const tokens = useAppSelector(selectAllTokenInfo);
  const dispatch = useAppDispatch();
  const { provider: library } = useWeb3React();
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const isSigning = ordersStatus === "signing";

  const [activeApproval, setActiveApproval] = useState<ApprovalEntity | null>(
    null
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

  const approvalTransaction = useApprovalPending(
    activeApproval?.tokenInfo?.address,
    true
  );

  const approvalEntities = useMemo(
    () => transformAllowancesToApprovalEntities(allowances, balances, tokens),
    [allowances, balances, tokens]
  );

  const sortedApprovalEntities = sortApprovalEntities(
    approvalEntities,
    activeSortType,
    sortTypeDirection[activeSortType]
  );

  const handleSortButtonClick = (sortType: ApprovalSortType) => {
    const currentSorting = sortTypeDirection[sortType];

    setActiveSortType(sortType);
    setSortTypeDirection({
      ...sortTypeDirection,
      [sortType]: !currentSorting,
    });
  };

  const handleEditButtonClick = (approval: ApprovalEntity) => {
    if (!approval.tokenInfo) {
      console.error("Approval tokenInfo is undefined");
      return;
    }

    if (!library) {
      console.error("library is undefined");
      return;
    }

    setActiveApproval(approval);

    // If the token is a collection, we set the allowance to 0 because we simply revoke the approval
    const allowance = isCollectionTokenInfo(approval.tokenInfo)
      ? "0"
      : formatUnits(approval.allowance, getTokenDecimals(approval.tokenInfo));

    dispatch(
      approve(allowance, approval.tokenInfo, library, approval.contract)
    );
  };

  return (
    <Container>
      <Title type="h2" as="h1">
        Approvals
      </Title>
      <StyledScrollContainer resizeDependencies={[sortedApprovalEntities]}>
        <ApprovalsGrid>
          <ApprovalsListSortButtons
            activeSortType={activeSortType}
            sortTypeDirection={sortTypeDirection}
            onSortButtonClick={handleSortButtonClick}
          />
          <ApprovalsList
            approvals={sortedApprovalEntities}
            onEditButtonClick={handleEditButtonClick}
          />
        </ApprovalsGrid>
      </StyledScrollContainer>

      <TransactionOverlay isHidden={!isSigning}>
        <WalletSignScreen type="signature" />
      </TransactionOverlay>

      <TransactionOverlay isHidden={isSigning || !approvalTransaction}>
        {approvalTransaction && (
          <ApprovalSubmittedScreen
            chainId={activeApproval?.tokenInfo?.chainId}
            transaction={approvalTransaction}
          />
        )}
      </TransactionOverlay>
    </Container>
  );
};
