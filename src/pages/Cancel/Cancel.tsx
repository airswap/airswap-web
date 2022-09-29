import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch } from "../../app/hooks";
import { useAppSelector } from "../../app/hooks";
import { CancelWidget } from "../../components/CancelWidget/CancelWidget";
import Page from "../../components/Page/Page";
import { decompressAndSetActiveOrder } from "../../features/takeOtc/takeOtcActions";
import { selectTakeOtcReducer } from "../../features/takeOtc/takeOtcSlice";
import { InvalidOrder } from "../OrderDetail/subcomponents";

const Cancel: FC = () => {
  const dispatch = useAppDispatch();
  const { compressedOrder } = useParams<{ compressedOrder: string }>();
  const { status, activeOrder } = useAppSelector(selectTakeOtcReducer);
  useEffect(() => {
    if (compressedOrder && !activeOrder) {
      dispatch(decompressAndSetActiveOrder({ compressedOrder, tokens: [] }));
    }
  }, [dispatch, compressedOrder]);
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
      <CancelWidget />
    </Page>
  );
};

export default Cancel;
