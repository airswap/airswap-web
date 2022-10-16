import React, { FC, useEffect } from "react";
import { useParams } from "react-router";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

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
  const { account, library } = useWeb3React<Web3Provider>();
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
      dispatch(fetchAllTokens(parseInt(activeOrder.chainId)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrder]);

  if (status === "idle" || !account || !library || !activeOrder) {
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
      <OrderDetailWidget
        account={account}
        library={library}
        order={activeOrder}
      />
    </Page>
  );
};

export default OrderDetail;
