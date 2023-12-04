import MyOrdersWidget from "../../components/@widgets/MyOrdersWidget/MyOrdersWidget";
import Page from "../../components/Page/Page";
import React, { FC } from "react";

const MyOrdersPage: FC = () => {
  return (
    <Page>
      <MyOrdersWidget />
    </Page>
  );
};

export default MyOrdersPage;
