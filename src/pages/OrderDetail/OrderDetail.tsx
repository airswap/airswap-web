import React, { FC } from "react";

import OrderDetailWidget from "../../components/OrderDetailWidget/OrderDetailWidget";
import Page from "../../components/Page/Page";

// swap detail page (swap-id/:datauri)

const OrderDetail: FC = () => {
  return (
    <Page>
      <OrderDetailWidget />
    </Page>
  );
};

export default OrderDetail;
