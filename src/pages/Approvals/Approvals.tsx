import { FC } from "react";

import { ApprovalsWidget } from "../../components/@widgets/ApprovalsWidget/ApprovalsWidget";
import { StyledPage } from "./Approvals.styles";

const Approvals: FC = () => {
  return (
    <StyledPage>
      <ApprovalsWidget />
    </StyledPage>
  );
};

export default Approvals;
