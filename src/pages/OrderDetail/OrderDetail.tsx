import React, { FC, useEffect } from "react";
import { useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import OrderDetailWidget from "../../components/OrderDetailWidget/OrderDetailWidget";
import Page from "../../components/Page/Page";
import {
  fetchAllTokens,
  selectMetaDataReducer,
} from "../../features/metadata/metadataSlice";
import { decompressAndSetActiveOrder } from "../../features/takeOtc/takeOtcActions";
import { selectTakeOtcReducer } from "../../features/takeOtc/takeOtcSlice";
import InvalidOrder from "./subcomponents/InvalidOrder/InvalidOrder";

const OrderDetail: FC = () => {
  const dispatch = useAppDispatch();
  const { compressedOrder } = useParams<{ compressedOrder: string }>();

  const { status, activeOrder } = useAppSelector(selectTakeOtcReducer);
  const { isFetchingAllTokens } = useAppSelector(selectMetaDataReducer);

  useEffect(() => {
    if (compressedOrder) {
      dispatch(decompressAndSetActiveOrder({ compressedOrder }));
    }
  }, [dispatch, compressedOrder]);

  useEffect(() => {
    if (activeOrder && !isFetchingAllTokens) {
      dispatch(fetchAllTokens(activeOrder.chainId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrder]);

  if (status === "idle" || !activeOrder) {
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
      <OrderDetailWidget order={activeOrder} />
    </Page>
  );
};

export default OrderDetail;
