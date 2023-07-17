import React, { FC } from "react";

import MyOrdersWidget from "../../components/MyOrdersWidget/MyOrdersWidget";
import Page from "../../components/Page/Page";

const MyOrdersPage: FC = () => {
  return (
    <Page>
      <MyOrdersWidget />
    </Page>
  );
};

export default MyOrdersPage;
