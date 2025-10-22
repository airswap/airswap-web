import { FC } from "react";

import { ApprovalEntity } from "../../../../../entities/ApprovalEntity/ApprovalEntity";
import { MobileApprovalListItem } from "../MobileApprovalListItem/MobileApprovalListItem";
import { Container } from "./MobileApprovalsList.styles";

type MobileApprovalsListProps = {
  approvals: ApprovalEntity[];
  onEditButtonClick: (approval: ApprovalEntity) => void;
};

export const MobileApprovalsList: FC<MobileApprovalsListProps> = ({
  approvals,
  onEditButtonClick,
}) => {
  return (
    <Container>
      {approvals.map((approval) => (
        <MobileApprovalListItem
          key={`${approval.tokenId}-${approval.contract}`}
          approval={approval}
          onEditButtonClick={onEditButtonClick}
        />
      ))}
    </Container>
  );
};
