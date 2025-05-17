import { FC } from "react";

import { ApprovalEntity } from "../../../../../entities/ApprovalEntity/ApprovalEntity";
import { ApprovalListItem } from "../ApprovalListItem/ApprovalListItem";
import { Container } from "./ApprovalsList.styles";

type ApprovalsListProps = {
  approvals: ApprovalEntity[];
  onEditButtonClick: (approval: ApprovalEntity) => void;
};

export const ApprovalsList: FC<ApprovalsListProps> = ({
  approvals,
  onEditButtonClick,
}) => {
  return (
    <Container>
      {approvals.map((approval) => (
        <ApprovalListItem
          key={`${approval.tokenId}-${approval.contract}`}
          approval={approval}
          onEditButtonClick={onEditButtonClick}
        />
      ))}
    </Container>
  );
};
