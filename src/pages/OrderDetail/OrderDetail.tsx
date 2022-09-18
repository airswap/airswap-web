import React, { FC, useEffect } from "react";
import { useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import OrderDetailWidget from "../../components/OrderDetailWidget/OrderDetailWidget";
import Page from "../../components/Page/Page";
import { decompressAndSetActiveOrder } from "../../features/takeOtc/takeOtcActions";
import { selectTakeOtcReducer } from "../../features/takeOtc/takeOtcSlice";
import InvalidOrder from "./subcomponents/InvalidOrder/InvalidOrder";

const OrderDetail: FC = () => {
  const dispatch = useAppDispatch();
  const { compressedOrder } = useParams<{ compressedOrder: string }>();

  const { status } = useAppSelector(selectTakeOtcReducer);

  useEffect(() => {
    if (compressedOrder) {
      // Coltrane gets type/overload error without the <any>, not sure why.
      dispatch(decompressAndSetActiveOrder(compressedOrder));
    }
  }, [dispatch, compressedOrder]);

  if (status === "idle") {
    return <Page />;
  }

  if (status === "not-found") {
    return (
      <Page>
        <InvalidOrder />
      </Page>
    );
  }

  return (
    <Page>
      <OrderDetailWidget />
    </Page>
  );
};

export default OrderDetail;
