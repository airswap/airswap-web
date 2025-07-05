import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { useWeb3React } from "@web3-react/core";

import { formatUnits } from "ethers/lib/utils";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenDecimals,
  isCollectionTokenInfo,
  isTokenInfo,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { ApprovalEntity } from "../../../entities/ApprovalEntity/ApprovalEntity";
import { transformAllowancesToApprovalEntities } from "../../../entities/ApprovalEntity/ApprovalEntityTransformers";
import { selectAllTokenInfo } from "../../../features/metadata/metadataSlice";
import { approve } from "../../../features/orders/ordersActions";
import { selectOrdersStatus } from "../../../features/orders/ordersSlice";
import { useAllowancesLoading } from "../../../hooks/useAllowancesLoading";
import useApprovalPending from "../../../hooks/useApprovalPending";
import ApprovalSubmittedScreen from "../../ApprovalSubmittedScreen/ApprovalSubmittedScreen";
import ModalOverlay from "../../ModalOverlay/ModalOverlay";
import TransactionOverlay from "../../TransactionOverlay/TransactionOverlay";
import { Title } from "../../Typography/Typography";
import WalletSignScreen from "../../WalletSignScreen/WalletSignScreen";
import {
  Container,
  ApprovalsGrid,
  StyledScrollContainer,
  StyledFadedScrollContainer,
  StyledLoadingSpinner,
  NoApprovalsFound,
  StyledModalOverlay,
} from "./ApprovalsWidget.styles";
import { sortApprovalEntities } from "./helpers";
import { ApprovalsList } from "./subcomponents/ApprovalsList/ApprovalsList";
import ApprovalsListSortButtons from "./subcomponents/ApprovalsListSortButtons/ApprovalsListSortButtons";
import EditApprovalModal from "./subcomponents/EditApprovalModal.tsx/EditApprovalModal";
import { ApprovalSortType } from "./types";

export const ApprovalsWidget: FC = () => {
  const { t } = useTranslation();
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
  const [showEditApprovalModal, setShowEditApprovalModal] = useState(false);
  const [editApprovalAmount, setEditApprovalAmount] = useState<string | null>(
    null
  );
  const [editApproval, setEditApproval] = useState<ApprovalEntity | null>(null);

  const approvalTransaction = useApprovalPending(
    activeApproval?.tokenInfo?.address,
    true
  );

  const isLoading = useAllowancesLoading();
  const approvalEntities = transformAllowancesToApprovalEntities(
    allowances,
    balances,
    tokens
  );

  const sortedApprovalEntities = sortApprovalEntities(
    approvalEntities,
    activeSortType,
    sortTypeDirection[activeSortType]
  );

  const showNoApprovalsFound = !isLoading && !sortedApprovalEntities.length;

  const handleSortButtonClick = (sortType: ApprovalSortType) => {
    const currentSorting = sortTypeDirection[sortType];

    setActiveSortType(sortType);
    setSortTypeDirection({
      ...sortTypeDirection,
      [sortType]: !currentSorting,
    });
  };

  const handleUpdateButtonClick = (value: string) => {
    setShowEditApprovalModal(false);

    if (!editApproval || !editApproval.tokenInfo) {
      console.error("activeApproval is undefined");
      return;
    }

    if (!library) {
      console.error("library is undefined");
      return;
    }

    dispatch(
      approve(value, editApproval.tokenInfo, library, editApproval.contract)
    );
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

    if (isTokenInfo(approval.tokenInfo)) {
      const allowance = formatUnits(
        approval.allowance,
        getTokenDecimals(approval.tokenInfo)
      );
      setEditApprovalAmount(allowance);
      setEditApproval(approval);
      setShowEditApprovalModal(true);
      return;
    }

    // If the token is a collection, we set the allowance to 0 because we simply revoke the approval
    dispatch(approve("0", approval.tokenInfo, library, approval.contract));
  };

  return (
    <Container>
      <Title type="h2" as="h1">
        {t("common.approvals")}
      </Title>
      <StyledScrollContainer>
        <ApprovalsGrid isLoading={isLoading}>
          <ApprovalsListSortButtons
            isDisabled={isLoading || !sortedApprovalEntities.length}
            activeSortType={activeSortType}
            sortTypeDirection={sortTypeDirection}
            onSortButtonClick={handleSortButtonClick}
          />
          <StyledFadedScrollContainer
            resizeDependencies={[sortedApprovalEntities]}
          >
            <ApprovalsList
              approvals={sortedApprovalEntities}
              onEditButtonClick={handleEditButtonClick}
            />
          </StyledFadedScrollContainer>

          {isLoading && <StyledLoadingSpinner />}
          {showNoApprovalsFound && (
            <NoApprovalsFound>{t("orders.noApprovalsFound")}</NoApprovalsFound>
          )}
        </ApprovalsGrid>
      </StyledScrollContainer>

      <StyledModalOverlay
        title={t("information.editApproval.title")}
        onClose={() => setShowEditApprovalModal(false)}
        isHidden={!showEditApprovalModal}
      >
        <EditApprovalModal
          editApprovalAmount={editApprovalAmount}
          onCloseButtonClick={() => setShowEditApprovalModal(false)}
          onUpdateButtonClick={handleUpdateButtonClick}
        />
      </StyledModalOverlay>

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
