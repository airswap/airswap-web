import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import OtcOrderDetailWidget from "../../components/@widgets/OtcOrderDetailWidget/OtcOrderDetailWidget";
import Page from "../../components/Page/Page";
import { fetchAllTokens } from "../../features/metadata/metadataActions";
import { selectMetaDataReducer } from "../../features/metadata/metadataSlice";
import { decompressAndSetActiveOrder } from "../../features/takeOtc/takeOtcActions";
import {
  reset,
  selectTakeOtcReducer,
} from "../../features/takeOtc/takeOtcSlice";
import { StyledLoadingSpinner } from "./OtcOrderDetail.styles";
import InvalidOrder from "./subcomponents/InvalidOrder/InvalidOrder";

const OtcOrderDetail: FC = () => {
  const dispatch = useAppDispatch();
  const { compressedOrder } = useParams<{ compressedOrder: string }>();

  // Temporary state to force a re-render when the order is switched
  const [isSwitchingOrder, setIsSwitchingOrder] = useState(false);

  const { status, activeOrder } = useAppSelector(selectTakeOtcReducer);
  const { isFetchingAllTokens } = useAppSelector(selectMetaDataReducer);

  useEffect(() => {
    if (compressedOrder) {
      dispatch(decompressAndSetActiveOrder({ compressedOrder }));
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, compressedOrder]);

  useEffect(() => {
    if (activeOrder && !isFetchingAllTokens) {
      dispatch(fetchAllTokens(activeOrder.chainId));
      setIsSwitchingOrder(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrder]);

  useEffect(() => {
    if (isSwitchingOrder) {
      setIsSwitchingOrder(false);
    }
  }, [isSwitchingOrder]);

  if (status === "invalid") {
    return (
      <Page>
        <InvalidOrder />
      </Page>
    );
  }

  if (status === "idle" || !activeOrder || isSwitchingOrder) {
    return (
      <Page>
        <StyledLoadingSpinner />
      </Page>
    );
  }

  return (
    <Page>
      <OtcOrderDetailWidget order={activeOrder} />
    </Page>
  );
};

export default OtcOrderDetail;
