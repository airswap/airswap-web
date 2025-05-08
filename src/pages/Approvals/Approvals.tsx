import { FC } from "react";

import { ApprovalsWidget } from "../../components/@widgets/ApprovalsWidget/ApprovalsWidget";
import Page from "../../components/Page/Page";

const Approvals: FC = () => {
  return (
    <Page>
      <ApprovalsWidget />
    </Page>
  );
};

export default Approvals;
