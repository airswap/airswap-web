import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch } from "../../app/hooks";
import { useAppSelector } from "../../app/hooks";
import { CancelWidget } from "../../components/@widgets/CancelWidget/CancelWidget";
import Page from "../../components/Page/Page";
import { decompressAndSetActiveOrder } from "../../features/takeOtc/takeOtcActions";
import { selectTakeOtcReducer } from "../../features/takeOtc/takeOtcSlice";
import { InvalidOrder } from "../OtcOrderDetail/subcomponents";

const Cancel: FC = () => {
  const dispatch = useAppDispatch();
  const { provider: library } = useWeb3React();

  const { compressedOrder } = useParams<{ compressedOrder: string }>();
  const { status, activeOrder } = useAppSelector(selectTakeOtcReducer);

  useEffect(() => {
    if (compressedOrder) {
      dispatch(decompressAndSetActiveOrder({ compressedOrder }));
    }
  }, [dispatch, compressedOrder]);

  if (status === "invalid") {
    return (
      <Page>
        <InvalidOrder />
      </Page>
    );
  }

  if (status === "idle" || !activeOrder || !library) {
    return <Page />;
  }

  return (
    <Page>
      <CancelWidget order={activeOrder} library={library} />
    </Page>
  );
};

export default Cancel;
